import * as fs from 'fs';

export function renderFile(src: string) {
  return new Promise(function (resolve, reject) {
    fs.readFile(src, {'encoding': 'utf8'}, function (err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

