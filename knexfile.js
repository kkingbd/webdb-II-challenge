module.exports = {
    knexConfig = {
        client : 'sqlite3',
        useNullAsDefault : true,
        connection : {
          filename: './data/lambda.sqlite3'
        },
    
      }
};