var should = require("should");
var sqlBuilder = require("../index");

describe("sqlBuilder", function(){

    describe("joinTable", function () {

        it("all required params provided", function () {
            var res = sqlBuilder.joinTable({
                t1: "mainTable",
                t2: "tableToJoin",
                conditions: {
                    "t1.field": "t2.field"
                }
            });
            res.should.not.have.property("err");
        });

        it("sample query is working", function(){
            var res = sqlBuilder.joinTable({
                t1: "mainTable",
                t2: "tableToJoin",
                conditions: {
                    "t1.field": "t2.field"
                }
            });
            res.should.have.property('query');
            res.should.have.property('bind');
        });

        it("fields argument is working", function(){
            var res = sqlBuilder.joinTable({
                t1: "mainTable",
                t2: "tableToJoin",
                conditions: {
                    "t1.field": "t2.field"
                },
                fields: ["field1", "field2"]
            });
            var testBool = /^SELECT\s((?!\*).+?) FROM/.test(res.query);
            testBool.should.equal(true);
        });



    });

});


