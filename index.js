
var queryBuilder = require("./queryBuilder");

var functions = {
    getTable: function(params){
        // predefinedDate: {field: "someField", key: "today"}
        // table: string
        // fields: [string]
        // limit: number
        // where : {}
        // order: string
        // between: {between obj: {key, from, to}}
        // having: [string]
        try{

            if(typeof params.table == "undefined") return {err: "table param required"};

            var queryArr = [params.table];
            var fields = "*";
            if(params.fields) fields = queryBuilder.buildFieldsformat(params.fields); // escapes every field
            var sql = 'SELECT '+fields+' FROM ??';
            var condSQLS = [];
            if(params.where)   condSQLS.push(queryBuilder.whereFormat(params.where));
            if(params.between) condSQLS.push(queryBuilder.getBetweenString(params.between));
            if(params.predefinedDate) condSQLS.push(queryBuilder.getPredefinedDateStr(params.predefinedDate));

            if(condSQLS.length) sql+=" WHERE " + condSQLS.join(" AND ");

            if(params.order) sql += queryBuilder.getOrderString(params.order);
            if(params.limit) sql +=  " LIMIT " + params.limit;
            if(params.having) sql += " HAVING " + params.having.join(" AND ");

            return {
                query: sql,
                bind : queryArr
            };

        }catch(e){
            return {
                err: e.message
            }
        };



    },
    /**
     *
     * @param params {}
     *       [string] table - required
     *       [any]    unit  - required
     *       [string] by    - required
     *       [array]  fields
     *       [num]    limit
     *       [string] order
     *
     * @returns {*|{err}|{query, bind}}
     */
    getBy: function(params){
        var by = params.by || "id";                                          // default is id
        params.where = {};
        params.where[by] = params.unit;
        return functions.getTable(params);
    },

    joinTable: function(params){
        // t1 : string  | main table
        // t2 : string  | table to join
        // conditions: {}
        // where: {}
        // fields: [string]
        // group: [string]
        // between: {between obj: {key, from, to}}
        try{


            var queryArr = [params.t1, params.t2];

            var fields = "*";
            var condSQLS = [];
            if(params.fields) fields = queryBuilder.buildFieldsformat(params.fields);
            var sql = 'SELECT '+fields+' FROM ?? T1 LEFT JOIN ?? T2 ';

            if(params.conditions) sql += "ON " + queryBuilder.getConditionsString(params.conditions);
            if(params.where)  condSQLS.push(queryBuilder.whereFormat(params.where));
            if(params.between) condSQLS.push(queryBuilder.getBetweenString(params.between));


            if(condSQLS.length) sql+=" WHERE " + condSQLS.join(" AND ");

            if(params.group) sql += " GROUP BY " + params.group.join(',');

            if(params.limit) sql += " LIMIT " + params.limit;

            return {
                query: sql,
                bind : queryArr
            };
        }catch(e){
            return {
                err: e.message
            }
        }

    },

    /*
     * Query update by multiple parameters
     * @param params {}
     *       [string]   table - required
     *       {}         set - required
     *       {}         where - required
     * @return resulte query
     */
    update: function(params){
        try{
            var queryArr = [params.table, params.set];
            var sql = 'UPDATE ?? SET ?';

            if(params.where) {
                sql += ' WHERE ' + queryBuilder.whereFormat(params.where);
            }

            return {
                query: sql,
                bind : queryArr
            };
        }catch(e){
            return {
                err: e.message
            }
        }

    }

};

for(var prop in functions){
    exports[prop] = functions[prop];
}
