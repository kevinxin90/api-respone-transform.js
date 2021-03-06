/**
 * @jest-environment node
 */

const ctd_tf = require("../built/transformers/ctd_transformer");
const fs = require("fs");
const path = require("path");

describe("test ctd transformer", () => {

    let response;
    let input;

    beforeEach(() => {
        const response_path = path.resolve(__dirname, './data/ctd/response.json');
        response = JSON.parse(fs.readFileSync(response_path));
        const edge_path = path.resolve(__dirname, './data/ctd/edge.json');
        const edge = JSON.parse(fs.readFileSync(edge_path));
        input = {
            response,
            edge
        }
    })

    test("test ctd wrapper", () => {
        let tf = new ctd_tf.default(input);
        let res = tf.wrap(response);
        expect(res).toHaveProperty("data");
        expect(res.data).toHaveLength(2);
        expect(res.data[0].PubMedIDs).toEqual(["21559390"]);
        expect(res.data[0].DiseaseID).toEqual("D008545");
    })

    test("test ctd wrapper if pubmed id field is not string", () => {
        const tf = new ctd_tf.default(input);
        const fake = [
            {
                DiseaseID: "MESH:D008545"
            }
        ]
        const res = tf.wrap(fake);
        expect(res).toHaveProperty("data");
        expect(res.data).toHaveLength(1);
        expect(res.data[0].PubMedIDs).toBeUndefined;
    })

    test("test ctd wrapper if disease id field is not string", () => {
        const tf = new ctd_tf.default(input);
        const fake = [
            {
                PubMedID: "12345"
            }
        ]
        const res = tf.wrap(fake);
        expect(res).toHaveProperty("data");
        expect(res.data).toHaveLength(1);
        expect(res.data[0].DiseaseIDs).toBeUndefined;
    })
})