/**
 * @jest-environment node
 */

const biolink_tf = require("../built/transformers/biolink_transformer");
const fs = require("fs");
const path = require("path");

describe("test biolink transformer", () => {

    let response;
    let input;

    beforeEach(() => {
        const response_path = path.resolve(__dirname, './data/biolink/response.json');
        response = JSON.parse(fs.readFileSync(response_path));
        const edge_path = path.resolve(__dirname, './data/biolink/edge.json');
        const edge = JSON.parse(fs.readFileSync(edge_path));
        input = {
            response,
            edge
        }
    })

    test("test biolink wrapper", () => {
        let tf = new biolink_tf.default(input);
        let res = tf.wrap(response);
        expect(res.associations[0].object.HGNC).toBe("10956");
        expect(res.associations[0].publications[0].id).toBe("21685912");
        expect(res.associations[1]).not.toHaveProperty("publications");
        expect(res.associations[1]).not.toHaveProperty("provided_by");
    });

    test("test biolink wrapper if no association field as root key", () => {
        let tf = new biolink_tf.default(input);
        let res = tf.wrap({ "data": [] });
        expect(res).toEqual({ "data": [] })
    });

    test("test biolink wrapper if no object id should be prefixed", () => {
        const tf = new biolink_tf.default(input);
        const res = tf.wrap(
            {
                associations: [
                    {
                        object: {
                            id: "MONDO:12345"
                        }
                    }
                ]
            });
        expect(res.associations[0].object.MONDO).toEqual("MONDO:12345")
    });

    test("test biolink wrapper if no object field present", () => {
        const tf = new biolink_tf.default(input);
        const fake_response = {
            associations: [
                {
                    object1: {
                        id: "MONDO:12345"
                    }
                }
            ]
        }
        const res = tf.wrap(fake_response);
        expect(res).toEqual(fake_response)
    });

    test("test biolink wrapper if no object.id field present", () => {
        const tf = new biolink_tf.default(input);
        const fake_response = {
            associations: [
                {
                    object: {
                        id1: "MONDO:12345"
                    }
                }
            ]
        }
        const res = tf.wrap(fake_response);
        expect(res).toEqual(fake_response)
    });

    test("test biolink jsonTransform function", () => {
        let tf = new biolink_tf.default(input);
        const wrapped_response = tf.wrap(response);
        let res = tf.jsonTransform(wrapped_response);
        expect(res).toHaveProperty("related_to");
        expect(res.related_to[0].HGNC).toEqual("10956");
        expect(res.related_to[0].pubmed[0]).toEqual("21685912");
        expect(res.related_to[0].relation).toEqual("contributes to condition");
        expect(res.related_to[0].source[0]).toEqual("https://archive.monarchinitiative.org/#gwascatalog");
        expect(res.related_to[0].taxid).toEqual("NCBITaxon:9606")
    });

})