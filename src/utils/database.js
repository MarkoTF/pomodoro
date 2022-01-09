import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import React from 'react';

const DB_NAME = 'pomodorodb.db';
const asset = require('./db.db');

export const openDatabase = () => {
  return SQLite.openDatabase(DB_NAME);
}

export const createRecord = (name, active, pColor, pValue, pTimes, srColor, srValue, srTimes, lrColor, lsValue, lsTimes, sound, vibrate) => new Promise((resolve, reject) =>{
  const db = openDatabase();
  console.log('reciasdfa:_1')
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
