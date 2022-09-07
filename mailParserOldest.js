module.exports = {
    run: function(){
        var Imap = require('imap');
        var MailParser = require('mailparser').mailParser;
        var Promise = require('bluebird');
        var logger = require('./logger.js');
        Promise.longStackTraces();
    
        const imapConfig = {
            user: 'camtracker@apps.wnybusco.com',
            password: 'moeSywbYAeGW',
            host: 'a2plcpnl0275.prod.iad2.secureserver.net',
            port: 993,
            tls: true
        };

        var imap = new Imap(imapConfig);
        Promise.promisifyAll(imap);

        imap.once("ready", execute());
        imap.once("error", function(err){
            logger.printWriteLine('IMAP connection error: ' + err.stack, 2);
        });
        logger.printWriteLine('Connectiing IMAP...', 1);
        imap.connect();

        function execute(){
            imap.openBox("INBOX", false, function(err, mailBox){
                if(err){
                    logger.printWriteLine(err, 2);
                    return;
                }
                imap.search(["UNSEEN"], function(err, results){
                    //if no new emails, done.
                    if(!results || !results.length){
                        logger.printWriteLine('Mailbox parsed for new cam errors, no new errors.', 0);
                        imap.end();
                        return;
                    }
    
                    //else, mark as read
                    /*
                    imap.setFlags(results, ['\\Seen'], function(err){
                        if(!err){
                            logger.printWriteLine('Mailbox parsed, ' + results.length + ' new messages marked as read.', 1);
                        }
                        else{
                            logger.printWriteLine(JSON.stringify(err, null, 2), 2);
                        }
                    }); */
    
                    //fetch bodies
                    var f = imap.fetch(results, { bodies: ""});
                    f.on("message", processMessage);
                    f.once("error", function(err){
                        logger.printWriteLine('Error fetching message bodies. ', 2);
                        logger.printWriteLine(Promise.reject(err), 2);
                        return Promise.reject(err);
                    });
                    f.once("end", function(){
                        logger.printWriteLine('Done fetching bodies of unread mail. ', 0);
                        imap.end();
                    });
                });
            });
        }

        function processMessage(msg, seqno){
            logger.printWriteLine('Processing message #: '+seqno, 1);
            //logger.printWriteLine(msg, 0);

            var parser = new MailParser();
            parser.on("headers", function(headers){
                logger.printWriteLine("Header: " + JSON.stringify(headers), 1);
            });

            parser.on('data', data => {
                if(data.type === 'text'){
                    logger.printWriteLine('Msg #:'+seqno, 1);
                    logger.printWriteLine(data.text, 1); // or data.html
                }
            });

            msg.on("body", function(stream){
                stream.on('data', function(chunk){
                    parser.write(chunk.toString("utf8"));
                });
            });
            msg.once("end", function(){
                logger.printWriteLine('Finished parsing msg '+seqno, 1);
                parser.end();
            });
        }
    }
}