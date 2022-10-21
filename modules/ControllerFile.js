let connectionRequest = require('./db')

controllerMethod: (req, res, next) => {
    //Establish the connection on this request
    connection = connectionRequest()

    //Run the query
    connection.query("SELECT * FROM table", function (err, result, fields) {
        if (err) {
            // If an error occurred, send a generic server failure
            console.log(`not successful! ${err}`)
            connection.destroy();

        } else {
            //If successful, inform as such
            console.log(`Query was successful, ${result}`)

            //send json file to end user if using an API
            res.json(result)

            //destroy the connection thread
            connection.destroy();
        }
    });
},

conn = await connPool.getConnection();
// We have error: Can't add new command when connection is in closed state
// I'm attempting to solve it by grabbing a new connection
if (!conn || !conn.connection || conn.connection._closing) {
  winston.info('Connection is in a closed state, getting a new connection');
  await conn.destroy(); // Toast that guy right now
  sleep.sleep(1); // Wait for the connection to be destroyed and try to get a new one, you must wait! otherwise u get the same connection
  conn = await connPool.connection.getConnection(); // get a new one
}
