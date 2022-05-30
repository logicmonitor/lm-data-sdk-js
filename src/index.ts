import {log} from './logs/Logs';

log.SendLogs(
    'This is a test message',
    {
        'system.aws.resourceid' : 'ksh-al2-trial-1',
    }
)