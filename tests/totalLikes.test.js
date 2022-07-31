const listHelper = require('../utils/list_helper')
const blogList = require('./blogList')
  

describe('total likes', () => {

    test('of empty list is zero', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })

    test('when list has one blog, total likes equals the single blog likes', () => {
        expect(listHelper.totalLikes([blogList[0]])).toBe(7)
    })

    test('of a bigger list is calculated right', () => {
        expect(listHelper.totalLikes(blogList)).toBe(56)
    })

})