
// const
// * __REQ_QUERY__
//
module.exports = {
  nocache: false,
  static: ['./static'],
  apis: {

    // path
    '/echo': {
      // METHOD
      'GET': {
        code: 0,
        msg: 'success'
      },
      'POST': '__REQ_QUERY__'
    },

    '/bye': {
      'GET': {
        code: 0,
        data: [1,2,3]
      },
      'POST': {
        code: 0,
        msg: 'response by post ',
      },
    },

  }
}
