var should = require("should");
var sqlBuilder = require("../index");

describe("sqlBuilder", function(){

    describe("update", function () {

        it("all required params provided", function () {
            var res = sqlBuilder.update({
                table: "sometable",
                set: {
                    field1: "somevalue",
                    field2: "someothervalue"
                }
            });
            res.should.not.have.property("err");
        });

        it("sample query is working", function(){
            var res = sqlBuilder.update({
                table: "sometable",
                set: {
                    field1: "somevalue",
                    field2: "someothervalue"
                }
            });
            res.should.have.property('query');
            res.should.have.property('bind');
        });

        it("where argument is working", function(){
            var res = sqlBuilder.update({
                table: "sometable",
                set: {
                    field1: "somevalue",
                    field2: "someothervalue"
                },
                where: {
                    date: "today"
                }
            });
            var testBool = /^UPDATE\s((?!\*).+?) WHERE/.test(res.query);
            testBool.should.equal(true);
        });



    });

});


