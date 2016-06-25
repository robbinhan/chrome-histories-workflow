var AlfredNode = require('alfred-workflow-nodejs');
const os = require('os')
var actionHandler = AlfredNode.actionHandler;
var workflow = AlfredNode.workflow;
workflow.setName("example-alfred-workflow-nodejs");
var Item = AlfredNode.Item;

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(os.homedir() + "/Library/Application\ Support/Google/Chrome/Default/History");

(function main() {
    // --- simple example of using action handler
    actionHandler.onAction("action1", function(query) {
        var Item = AlfredNode.Item;
        db.serialize(function() {
          const sql = "select datetime(last_visit_time/1000000-11644473600,'unixepoch') dt,url from urls where url like '%" + query + "%'order by last_visit_time desc limit 10";
          db.all(sql, function(err, rows) {
              // console.log(rows);
              rows.map((row)=>{
                var item1 = new Item({
                    title: row.url,
                    arg: row.url,
                    subtitle: "you are querying " + query,
                    valid: true,
                    icon: './chrome_icon.png'
                })
                workflow.addItem(item1);
              })
              workflow.feedback();
          });
        });
        db.close();
    });

    AlfredNode.run();
})();
