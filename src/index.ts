import {Log} from './api/logs/Logs';

let log = new Log(true, 10);
log.SendLogs(
    'This is a test message',
    {
        'system.aws.resourceid' : 'ksh-al2-trial-1',
    }
)
setTimeout(() => {
    log.SendLogs(
        'This is a test message2',
        {
            'system.aws.resourceid' : 'ksh-al2-trial-1',
        }
    )
}, 1000);

setTimeout(() => {
    log.SendLogs(
        'This is a test message3',
        {
            'system.aws.resourceid' : 'ksh-al2-trial-1',
        }
    )
}, 5000);

setTimeout(() => {
    log.SendLogs(
        'This is a test message4',
        {
            'system.aws.resourceid' : 'ksh-al2-trial-1',
        }
    )
}, 15000);
