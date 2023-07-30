import os
import shutil
from datetime import datetime


def move(suffix=None):
    extension = suffix or 'jpg'
    file_names = [f.name for f in os.scandir() if f.name.endswith(f'.{extension}')]
    for file_name in file_names:
        date_str = file_name.split(' ')[0]
        try:
            date_data = datetime.strptime(date_str, '%Y-%m-%d')
        except Exception as e:
            continue
        # TODO: スラッシュやめる
        # TODO: 実行対象のパスからの相対パスにする
        dir_name = f'{date_data.year}/{date_data.year}-{str(date_data.month).zfill(2)}'
        if suffix:
            dir_name = f'{date_data.year}/{suffix}/{date_data.year}-{str(date_data.month).zfill(2)}-{suffix}'
        os.makedirs(dir_name, exist_ok=True)
        try:
            shutil.move(file_name, dir_name)
        except Exception as e:
            print(e)


def main():
    move(None)
    move('png')
    move('mov')
    move('mp4')
    move('gif')
    move('JPG')


if __name__ == '__main__':
    main()
