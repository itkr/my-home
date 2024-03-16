import subprocess
from datetime import datetime
from datetime import timedelta

from const import REC_LIST


def format_time(string_time):
    return datetime.strptime(string_time, '%H:%M:%S').time().strftime('%H%M%S')


def rec(broadcaster_id, s):
    # cmd = ['radigo', 'rec', f'-id={broadcaster_id}', f'-s={s}']
    cmd = ['/Users/itkr/go/bin/radigo', 'rec', f'-id={broadcaster_id}', f'-s={s}']
    subprocess.call(cmd)


# TODO: 1回のみ録音するようにする
# TODO: 保存先を指定する

def main():
    for rec_item in REC_LIST:
        broadcaster_id = rec_item['broadcaster_id']
        start_time = format_time(rec_item['start_time'])
        weekday = rec_item['weekday']

        target_day = datetime.today()
        while target_day.weekday() != weekday:
            target_day = target_day - timedelta(days=1)

        string_datetime = f"{target_day.strftime('%Y%m%d')}{start_time}"
        rec(broadcaster_id, string_datetime)


if __name__ == '__main__':
    main()
