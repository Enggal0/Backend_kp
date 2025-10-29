import moment from 'moment';

export const validDate = (data) => moment(new Date(data), 'YYYY-MM-DD').toISOString();

export const formatDate = (data) => moment(data).locale('id').format('DD MMMM YYYY');
