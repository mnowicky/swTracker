module.exports = {
    run: function(){
        var Imap = require('imap'),
            inspect = require('util').inspect;
        var fs = require('fs'), fileStream;
        var logger = require('./logger.js');
        var buffer = '';

        var myMap;

        var imap = new Imap({
            user: "camtracker@apps.wnybusco.com",
            password: "moeSywbYAeGW",
            host: "a2plcpnl0275.prod.iad2.secureserver.net",
            port: 993,
            tls: true,
            connTimeout: 10000,
            authTimeout: 5000,
            debug: console.log,
            tlsOptions: { rejectUnauthorized: false },
            mailbox: "INBOX",
            searchFilter: ["UNSEEN", "FLAGGED"], // the search filter being used after an IDLE notification has been retrieved 
            markSeen: false, // all fetched email willbe marked as seen and not fetched next time 
            fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`, 
            mailParserOptions: { streamAttachments: false }, // options to be passed to mailParser lib. 
            attachments: false, // download attachments as they are encountered to the project directory 
            attachmentOptions: { directory: "attachments/" } 
        });

        function openInbox(cb){
            imap.openBox('Inbox', false, cb);
        }

        imap.once('ready', function(){
            logger.printWriteLine('Parsing inbox for new error alerts...', 1);
            openInbox(function (err, box){
                if(err) throw err;
                    imap.search(
                        ['UNSEEN', ['SUBJECT', 'Error Alerts']], 
                        function(err, results){
                        if(err) throw err;
                    else if(!results || !results.length){
                        logger.printWriteLine('No new emails', 2);
                    }
                    else{
                        var f = imap.fetch(results, {bodies: '1', markSeen: true});
                        console.log('value of f: ' +f);
                        f.on('message', function(msg, seqno){
                            logger.printWriteLine('message #:'+seqno, 1);
                            //logger.printWriteLine('message type: '+msg.txt, 1);
                            var prefix = '(#' + seqno + ') ';
                            msg.on('body', function (stream, info){
                                stream.on('data', function(chunk){
                                    buffer += chunk.toString('utf8');
                                    //console.log('Buffer: '+buffer);
                                })
                                stream.once('end', function(){
                                    if(info.which === '1'){
                                        console.log('Buffer 2: ' + buffer);
                                    }
                                });
                                //console.log(prefix + 'Body');
                                stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
                            });
                            /*
                            msg.once('attributes', function (attrs) {
                                console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                            });
                            */
                            msg.once('end', function () {
                                logger.printWriteLine(prefix + ' - End of message.', 1);
                            });
                        });
                        f.once('error', function (err) {
                            console.log('Fetch error: ' + err);
                        });
                        f.once('end', function () {
                            logger.printWriteLine('Done fetching messages.', 1);
                            imap.end();
                        });

                    }
                });
            });
        });
        imap.once('error', function (err) {
        console.log(err);
        });
        
        imap.once('end', function () {
        console.log('Connection ended');
        });

        imap.connect();
    }
}