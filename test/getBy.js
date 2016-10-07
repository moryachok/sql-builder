var should = require("should");
var sqlBuilder = require("../index");

describe("sqlBuilder", function(){

    describe("getBy", function () {

        it("all required params provided", function () {
            var res = sqlBuilder.getBy({table: "sometable", by: "field", unit: "value"});
            res.should.not.have.property("err");
        });

        it("sample query is working", function(){
            var res = sqlBuilder.getBy({table: "sometable", by: "field", unit: "value"});
            res.should.have.property('query');
            res.should.have.property('bind');
        });

        it("fields argument is working", function(){
            var res = sqlBuilder.getTable({table: "sometable", by: "field", unit: "value", fields: ['field1','field2']});
            var testBool = /^SELECT\s((?!\*).+?) FROM/.test(res.query);
            testBool.should.equal(true);
        });



    });

});


