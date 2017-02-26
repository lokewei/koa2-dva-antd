import db from '../lib/db';
import _ from 'lodash'
import moment from 'moment'

const buildConditions = (params = {}) => {
  const conditions = [];
  const values = [];

  if (typeof params.field !== 'undefined'
      && typeof params.keyword !== 'undefined') {
    conditions.push(`${params.field} like ?`);
    values.push(`%${params.keyword}%`);
  }

  return {
    where: conditions.length ?
             conditions.join(' AND ') : '1=1',
    values
  };
}


export default {
  list: async(params, pagination) => {
    const conditions = buildConditions(params);
    const page = pagination.page;
    const pageSize = pagination.pageSize;
    const skip = (page - 1) * pageSize;
    const limit = `${skip}, ${skip + pageSize}`;
    const totalResult = await db.query(`select count(1) as total from tv_travel where ${conditions.where}`, conditions.values);
    const total = totalResult[0].total;
    const pageNum = Math.ceil(total / pageSize);
    const data = await db.query(`select * from tv_travel where ${conditions.where} LIMIT ${limit}`, conditions.values);
    if (page > pageNum) {
      return null;
    }
    return {
      data,
      page: {
        current: page,
        pageSize,
        total
      }
    }
  },

  getById: async(id) => {
    return await db.query('select * from tv_travel where ID = ?', [id]);
  },

  create: async (dest, travelDate, travelDays, adultNo, childrenNo, name, phoneNumber, remarks, status) => {
    const now = new Date();
    const fromRecord = await db.query('select post_title from tv_posts where ID = ?', [dest]);
    if (fromRecord.length < 0) {
      return null;
    }
    const fields = ['dest', 'dest_name', 'travel_date', 'travel_days', 'adult_no'];
    console.log(moment(travelDate, 'YYYY-MM-DD').toString());
    const travDate = moment(travelDate, 'YYYY-MM-DD').toDate();
    const values = [dest, fromRecord[0].post_title, travDate, travelDays, adultNo];
    if (!_.isEmpty(childrenNo)) {
      fields.push('children_no');
      values.push(childrenNo);
    }

    fields.push('name');
    values.push(name);

    fields.push('phone_number');
    values.push(phoneNumber)

    if (!_.isEmpty(remarks)) {
      fields.push('remarks');
      values.push(remarks);
    }
    if (!_.isEmpty(status)) {
      fields.push('travel_status');
      values.push(status);
    }
    fields.push('create_date');
    values.push(now);
    const createFields = fields.length ? `${fields.join(' , ')}` : ''
    const places = Array(fields.length).fill('?').join(',');
    await db.query(`
      insert into
      tv_travel(${createFields})
      values(${places})`
    , values);
  },

  update: async (id, params) => {
    const { dest, travel_date, travel_days, adult_no,
      children_no, name, phone_number, remarks, travel_status } = params;
    const conditions = [];
    const values = [];
    if (!_.isEmpty(dest)) {
      conditions.push('dest = ?');
      values.push(dest);
    }
    if (!_.isEmpty(travel_date)) {
      conditions.push('travel_date = ?');
      values.push(travel_date);
    }
    if (!_.isEmpty(travel_days)) {
      conditions.push('travel_days = ?');
      values.push(travel_days);
    }
    if (!_.isEmpty(adult_no)) {
      conditions.push('adult_no = ?');
      values.push(adult_no);
    }
    if (!_.isEmpty(children_no)) {
      conditions.push('children_no = ?');
      values.push(children_no);
    }
    if (!_.isEmpty(name)) {
      conditions.push('name = ?');
      values.push(name);
    }
    if (!_.isEmpty(phone_number)) {
      conditions.push('phone_number = ?');
      values.push(phone_number);
    }
    if (!_.isEmpty(remarks)) {
      conditions.push('remarks = ?');
      values.push(remarks);
    }
    if (!_.isEmpty(travel_status)) {
      conditions.push('travel_status = ?');
      values.push(travel_status);
    }
    const updateFields = conditions.length ? `${conditions.join(' , ')}, ` : ''
    const now = new Date();
    values.push(now);
    values.push(id);
    await db.query(`
      update tv_travel
      set ${updateFields} last_modified = ?
      where ID = ?
    `, values);
  },

  changeStatus: async (id, status) => {
    await db.query(`
      update tv_travel
      set travel_status = ?
      where ID = ?
    `, [status, id]);
  },

  delete: async (id) => {
    if (!id) {
      return null;
    }
    await db.query(`
      delete from tv_travel where ID = ?
    `, [id]);
  }

}
