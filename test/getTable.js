var should = require("should");
var sqlBuilder = require("../index");

describe("sqlBuilder", function(){

    describe("getTable", function () {

        it("all required params provided", function () {
            var res = sqlBuilder.getTable({table: "sometable"});
            res.should.not.have.property("err");
        });

        it("sample query is working", function(){
            var res = sqlBuilder.getTable({table: "sometable"});
            res.should.have.property('query');
            res.should.have.property('bind');
        });

        it("fields argument is working", function(){
            var res = sqlBuilder.getTable({table: "sometable", fields: ['field1','field2']});
            var testBool = /^SELECT\s((?!\*).+?) FROM/.test(res.query);
            testBool.should.equal(true);
        });

        it("limit argument provided is a number", function(){
            var res = sqlBuilder.getTable({table: "sometable", limit: 1000});
            var testBool = /LIMIT\s\d+?$/.test(res.query);
            testBool.should.equal(true);
        });

        it("where argument works", function(){
            var res = sqlBuilder.getTable({table: "sometable", where: {
                name: "Misha"
            }});
            var testBool = /\?\?\sWHERE/.test(res.query);
            testBool.should.equal(true);
        });

        it("where argument with AND stmt", function(){
            var res = sqlBuilder.getTable({table: "sometable", where: {
                name: "Misha",
                lastName: "Green"
            }});
            // console.log(res);
            var testBool = /\?\?\sWHERE.+?\sAND\s/.test(res.query);
            testBool.should.equal(true);
        });

        it("where argument with OR stmt", function(){
            var res = sqlBuilder.getTable({table: "sometable",
                where: [
                    {name: "Misha"},
                    {name: "Max"}
                ]
            });
            // console.log(res);
            var testBool = /\?\?\sWHERE.+?\sOR\s/.test(res.query);
            testBool.should.equal(true);
        });

        it("where argument with AND,OR stmts", function(){
            var res = sqlBuilder.getTable({table: "sometable",
                where: [
                    {name: "Misha", lastName:"Green"},
                    {name: "Max"}
                ]
            });
            // console.log(res);
            var testBool = /^(?=.*\bOR\b)(?=.*\bAND\b).*$/.test(res.query);
            testBool.should.equal(true);
        });

        it("order argument works (ASC)", function(){
            var res = sqlBuilder.getTable({table: "sometable", order: "date"});
            // console.log(res);
            var testBool = /ORDER\sBY/.test(res.query);
            testBool.should.equal(true);
        });

        it("order argument works (DESC)", function(){
            var res = sqlBuilder.getTable({table: "sometable", order: "-date"});
            // console.log(res);
            var testBool = /ORDER\sBY\s.+?DESC$/.test(res.query);
            testBool.should.equal(true);
        });


    });

});


