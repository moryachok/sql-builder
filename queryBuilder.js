var moment = require('moment');
var mysql = require("mysql");

function paramsException(msg){
    this.message = msg;
    this.name = "params exception";
    this.from = "queryBuilder.js";
}


var functions = {

    whereFormat: function(where){
        // expect [{}]
        if(!(where instanceof Array)){
            where = [where];
        }
        
        var OR = [], obj, arr = [];
        for(var i=0;i<where.length;i++){
            obj = where[i];
            for (var key in obj) {

                // TODO: change escape functions and remove mysql module
                var escapedKey = mysql.escape(obj[key]);
                arr.push(mysql.escapeId(key) + '=' + escapedKey);  
            };
            OR.push(arr.join(' AND '));
            arr = [];
        }
        
        return OR.join(" OR ");
    },
    
    buildFieldsformat: function(fields){
        fields = fields.join(",");
        return fields;
    },

    getPredefinedDateStr: function(params){                      // defining predefined strings for mysql queries (today, yesterday, last30days etc...)
        // field: string
        // key: string
        var output = "", days;
        switch(true){

            case /today/.test(params.key):
                output+= params.field+"=CURDATE()";
                break;

            case /yesterday/.test(params.key):
                output+= params.field+"=DATE_SUB(CURDATE(),INTERVAL 1 DAY)";
                break;

            case /currentMonth/.test(params.key):
                output+= params.field+" BETWEEN concat(date_format(LAST_DAY(now()),'%Y-%m-'),'01') AND CURDATE()";
                break;
                
            case /lastMonth/.test(params.key):
                output+= params.field+" like concat(date_format( DATE_SUB(CURDATE(),INTERVAL 1 MONTH),'%Y-%m-'), '%')";
                break;
                
            case /last30Days/.test(params.key):
                output+= params.field+" BETWEEN concat(DATE_SUB(CURDATE(),INTERVAL 30 DAY)) AND CURDATE()";
                break;
                
            case /allTimes/.test(params.key):
                output+= params.field;
                break;
        }
        
        return output;
    },

    getBetweenString: function(params){
        // key: string
        // from: datestring
        // to: datestring (optional)
        if(typeof params.key  == "undefined") throw new paramsException("between.key argument required");
        if(typeof params.from == "undefined") throw new paramsException("between.from argument required");

        var to = params.to || moment().format("YYYY-MM-DD");
        return mysql.escapeId(params.key) + " BETWEEN " + mysql.escape(params.from) + " AND " + mysql.escape(to);

    },

    getOrderString: function(order){
        var move = "ASC", result = " ORDER BY ";
        order = order.split(",");
        for(key in order) {
            if(order[key].charAt(0)=="-"){
                order[key] = order[key].replace("-","");
                move = "DESC";
            }
            result += mysql.escapeId(order[key]) + " " + move + ",";
        }
        result = result.substring(0, result.length - 1);
        return result;
    },


    getConditionsString: function(obj){
        // expect {}
        var arr = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                arr.push(mysql.escapeId(key) + '=' + mysql.escapeId(obj[key]));
            }
        };
        return arr.join(' AND ');
    }

};


for(var prop in functions){
	exports[prop] = functions[prop];
}
