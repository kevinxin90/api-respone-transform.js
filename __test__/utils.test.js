/**
 * @jest-environment node
 */

const utils = require("../built/utils");

describe("test utils module", () => {

    describe("test generateCurie function", () => {
        test("test if id is a list", () => {
            const inputIDs = ["1017", "1018"];
            const res = utils.generateCurie("NCBIGene", inputIDs);
            expect(res).toEqual("NCBIGene:1017")
        })

        test("test if id is not a list", () => {
            const inputIDs = "1017";
            const res = utils.generateCurie("NCBIGene", inputIDs);
            expect(res).toEqual("NCBIGene:1017")
        })

        test("test if id is already curied", () => {
            const inputIDs = "NCBIGene1:1017";
            const res = utils.generateCurie("NCBIGene", inputIDs);
            expect(res).toEqual("NCBIGene:1017")
        })

    })

    describe("Test toArray function", () => {
        test("test if input is already an array", () => {
            const input = [1];
            const res = utils.toArray(input);
            expect(res).toEqual(input);
        })

        test("test if input is not an array", () => {
            const input = 1;
            const res = utils.toArray(input);
            expect(res).toEqual([1]);
        })
    })


})