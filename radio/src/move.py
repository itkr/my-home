# TODO: パス表記の汎用化
# TODO: 実行対象のパスからの相対パスにする

import os
import shutil
from datetime import datetime
from const import REC_LIST


def move(suffix=None):
    extension = suffix or 'aac'
    file_names = [f.name for f in os.scandir('output') if f.name.endswith(f'.{extension}')]

    for file_name in file_names:
        # '20230414113000-FMT.aac'
        file_name = file_name.replace(f'.{extension}', '')  # '20230414113000-FMT'
        (date_str, broadcaster_id) = file_name.split('-')  # '20230414113000', 'FMT'
        date_data = datetime.strptime(date_str, '%Y%m%d%H%M%S')  # 2023-04-14 11:30:00

        for rec in REC_LIST:
            if rec['broadcaster_id'] == broadcaster_id and \
                    date_data.strftime('%H:%M:%S') == rec['start_time'] and \
                    date_data.weekday() == rec['weekday']:
                dir_name = f'output/{rec["name"]}/{date_data.year}/{str(date_data.month).zfill(2)}'
                os.makedirs(dir_name, exist_ok=True)
                try:
                    shutil.move(f'output/{file_name}.{extension}', dir_name)
                except Exception as e:
                    print(e)


def main():
    move(None)


if __name__ == '__main__':
    main()
