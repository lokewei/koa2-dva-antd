import db from '../lib/db';
import _ from 'lodash'

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

  create: async (dest, travelDate, travelDays, adultNo, childrenNo, name, phoneNumber, remarks, status) => {
    const now = new Date();
    await db.query(`
      insert into
      tv_travel(
        dest,
        travel_date,
        travel_days,
        adult_no,
        children_no,
        name,
        phone_number,
        remarks,
        travel_status,
        create_date
      )
      values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    , [travelDate, travelDays, adultNo, childrenNo, name, phoneNumber, remarks, status, now]);
  },

  update: async (id, params) => {
    const { dest, travelDate, travelDays, adultNo,
      childrenNo, name, phoneNumber, remarks, status } = params;
    const conditions = [];
    const values = [];
    if (!_.isEmpty(dest)) {
      conditions.push('dest = ?');
      values.push(dest);
    }
    if (!_.isEmpty(travelDate)) {
      conditions.push('travel_date = ?');
      values.push(travelDate);
    }
    if (!_.isEmpty(travelDays)) {
      conditions.push('travel_days = ?');
      values.push(travelDays);
    }
    if (!_.isEmpty(adultNo)) {
      conditions.push('adult_no = ?');
      values.push(adultNo);
    }
    if (!_.isEmpty(childrenNo)) {
      conditions.push('children_no = ?');
      values.push(childrenNo);
    }
    if (!_.isEmpty(name)) {
      conditions.push('name = ?');
      values.push(name);
    }
    if (!_.isEmpty(phoneNumber)) {
      conditions.push('phone_number = ?');
      values.push(phoneNumber);
    }
    if (!_.isEmpty(remarks)) {
      conditions.push('remarks = ?');
      values.push(remarks);
    }
    if (!_.isEmpty(status)) {
      conditions.push('travel_status = ?');
      values.push(status);
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
