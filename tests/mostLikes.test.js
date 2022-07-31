const listHelper = require('../utils/list_helper')
const blogList = require('./blogList')

describe('most likes', () => {
    test('of empty array, returns the correct object', () => {
        expect(listHelper.mostLikes([]))
        .toEqual(
            {
                author: null,
                likes: 0
            }
        )
    })

    test('of one, returns this one author and likes count', () => {
        expect(listHelper.mostLikes([blogList[0]]))
        .toEqual(
            {
                author: 'Michael Chan',
                likes: 7
            }
        )
    })

    test('of some, returns the correct author and likes count', () => {
        expect(listHelper.mostLikes(blogList.slice(0, 3)))
        .toEqual(
            {
                author: "Edsger W. Dijkstra",
                likes: 17
            }
        )
    })  


    test('of many, returns the correct author and likes count', () => {
        expect(listHelper.mostLikes(blogList))
        .toEqual(
            {
                author: "Robert C. Martin",
                likes: 32
            }
        )
    })
})