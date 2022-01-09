import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import React from 'react';

const DB_NAME = 'pomodorodb.db';
const asset = require('./db.db');

export const openDatabase = () => {
  return SQLite.openDatabase(DB_NAME);
}

export const changeActive = (id) => new Promise((resolve, reject) => {
  const db = openDatabase();
  db.transaction((tx) => {
    tx.executeSql(
      `UPDATE profile SET active = 0 WHERE active = 1;`, [],
      (_, desactiveRecord) => {
	tx.executeSql(
	  `UPDATE profile SET active = 1 WHERE id = ?`, [id],
	  (_, activeRecord) => {
	    tx.executeSql(
	      `SELECT * FROM profile WHERE id = ?`, [id],
	      (_, saRecord) => {
		resolve(saRecord);
	      }, (_, err) => {
	      }
	    )
	  }, (_, err) => {
	    console.log(err);
	  }
	)
      }, (_, err) => {
	console.log(err);
      }
    );
  });
});

export const removeProfile = (id) => new Promise((resolve, reject) => {
  const db = openDatabase();
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM profile WHERE id = ?;', [id],
      (_, result) => {
	tx.executeSql(
	  'SELECT * FROM profile LIMIT 1;',[],
	  (_, result) => {
	    changeActive(result.rows._array[0].id).then((newActive) => {
	      resolve(newActive);
	    });
	  }
	);
      }, (_, err) => {
	reject(err)
      }
    );
  });
});

export const createRecord = (name, active, pColor, pValue, pTimes, srColor, srValue, srTimes, lrColor, lsValue, lsTimes, sound, vibrate) => new Promise((resolve, reject) =>{
  const db = openDatabase();
  db.transaction((tx) => {
    console.log('dentro tx')
    tx.executeSql(
      `INSERT INTO profile (\
	name,\
	active,\
	pomodoro_color,\
	pomodoro_value,\
	pomodoro_times,\
	short_rest_color,\
	short_rest_value,\
	short_rest_times,\
	long_rest_color,\
	long_rest_value,\
	long_rest_times,\
	sound,\
	vibrate\
      ) VALUES (\
	?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [name, active, pColor, pValue, pTimes, srColor, srValue, srTimes, lrColor, lsValue, lsTimes, sound, vibrate],
      (_, record) => {
	console.log('reciasdfa')
	console.log(record)
	resolve(record)
      },
      (_, err) => {
	console.log(err);
	reject(err)
      }
    );
  });
});

export const updateProfile = (id, name, active, pColor, pValue, pTimes, srColor, srValue, srTimes, lrColor, lsValue, lsTimes, sound, vibrate) => new Promise((resolve, reject) => {
  const db = openDatabase();
  console.log('update, database')
  db.transaction((tx) => {
    tx.executeSql(
      `UPDATE profile SET\
	name = ?,\
	active = ?,\
	pomodoro_color = ?,\
	pomodoro_value = ?,\
	pomodoro_times = ?,\
	short_rest_color = ?,\
	short_rest_value = ?,\
	short_rest_times = ?,\
	long_rest_color = ?,\
	long_rest_value = ?,\
	long_rest_times = ?,\
	sound = ?,\
	vibrate = ?\
	WHERE id = ?;`,
      [name, active, pColor, pValue, pTimes, srColor, srValue, srTimes, lrColor, lsValue, lsTimes, sound, vibrate, id],
      (_, result) => {
	resolve(result)
      }, (_, err) => {
	reject(err);
      }
    );
  });
});

export const getActivated = () => new Promise((resolve, reject) => {
  const db = openDatabase();
  let profile;
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM profile WHERE ACTIVE = 1;",[],
      (tanx, result) => {
	if (result.rows.length > 0){
	  resolve(result)
	  profile = result;
	  // tx.executeSql('delete from profile')
	  // tx.executeSql('drop table profile')
	} else {
	  // tx.executeSql('drop table profile')
	  createRecord('default', 1, '#E54881', 20, 4, '#86DCEF', 5, 3, '#5E8ED7', 15, 1, 'test', 1).then((newProfile) => {
	    tx.executeSql(
	      "SELECT * FROM profile WHERE ACTIVE = 1;",[],
	      (r_tanx, r_result) => {
		resolve(r_result)
	      }
	    );
	  });
	}
      }
    );
  });
}); 
