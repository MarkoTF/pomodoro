import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import React from 'react';

const DB_NAME = 'pomodorodb.db';
const asset = require('./db.db');

export const openDatabase = () => {
  return SQLite.openDatabase(DB_NAME);
}

/**
  * Módulo de la base de datos
  *
  * En este modulo se encuentran las operaciones relacionadas
  * al CRUD.
  *
  * Se hace uso de SQLite para tener una base de datos local
  *
  * Todas las funciones son promesas de javascript, de esta manera
  * se evita que la pantalla del usuario quede bloqueada mientras
  * se sesuelve una operación
  * */

export const changeActive = (id) => new Promise((resolve, reject) => {
  /**
    * Cambia el perfil activado por el solicitado
    *
    * :parametro id: Es el id del perfil que se quere activa
    * :return : Retorna los datos del perfil que se ha activado
    * */
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
  /**
    * Elimina de la base de datos el perfil dado
    *
    * Ya que el perfil a eliminar es el perfil que acutualmente 
    * se encuentra ctivo, al eliminarlo es necesario activar
    * uno nuevo
    *
    * :parámetro id: El id del perfil que se desea eliminar
    * :return: devuelve los datos del nuevo perfil que se ha activado
    * */
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
  /**
    * Crea perfil
    *
    * :parámetro name: el nombre que tendrá el perfil
    * :parámetro active: Si el perfil estará activo o no al momento de su creación:
    * :parametro pColor: El color del pomodoro
    * :parámetro pValue: Los minútos que tendrá el pomodoor
    * :parámetro pTimes: La catidad de veces que se repite un pomodoro
    * :parámetro srColor: color del descanso corto
    * :parámetro srValue: minutos que durará el descaso corto
    * :parámetro srTimes: la cantidad de veces que se repetira el descanso corto
    * :parámetro lrColor: Color del descanso largo
    * :parámetro lsValue: Los minutos de duración del descanso largo
    * :parámetro lsTimes: Las veces que se repetirá el descanso largo
    * :parámetro sound: el sonido que se hará al terminar un pomodoro, un descanso corto o un descanso largo
    * :parámetro vibrate: ¿el celular vibrará o no?
    * :return: devuelve los datos del nuevo perfil creado
    * */
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
  /**
    * Crea acutaliza perfil
    *
    * :parámetro name: el nombre que tendrá el perfil
    * :parámetro active: Si el perfil estará activo o no al momento de su creación:
    * :parametro pColor: El color del pomodoro
    * :parámetro pValue: Los minútos que tendrá el pomodoor
    * :parámetro pTimes: La catidad de veces que se repite un pomodoro
    * :parámetro srColor: color del descanso corto
    * :parámetro srValue: minutos que durará el descaso corto
    * :parámetro srTimes: la cantidad de veces que se repetira el descanso corto
    * :parámetro lrColor: Color del descanso largo
    * :parámetro lsValue: Los minutos de duración del descanso largo
    * :parámetro lsTimes: Las veces que se repetirá el descanso largo
    * :parámetro sound: el sonido que se hará al terminar un pomodoro, un descanso corto o un descanso largo
    * :parámetro vibrate: ¿el celular vibrará o no?
    * :return: devuelve los datos del nuevo perfil actualizado
    * */
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
  /**
    * Devuelve los datos del perfil que se encuentra activado
    * Este método es especialmente útil al momento de iniciar la app, ya
    * que se consulta cual es el perfil que se encuentra guardado como
    * activado
    * */
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
