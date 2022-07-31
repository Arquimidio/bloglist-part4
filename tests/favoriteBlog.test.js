const listHelper = require('../utils/list_helper')
const blogList = require('./blogList')

describe('favorite blog', () => {

    test('of single blog returns the single blog', () => {
        expect(listHelper.favoriteBlog([blogList[0]]))
        .toEqual(
            {
                title: "React patterns",
                author: "Michael Chan",
                likes: 7,
            }
        )
    })

    test('of blogs with different likes count returns the one with the most likes', () => {
        expect(listHelper.favoriteBlog(blogList.slice(0, 3)))
        .toEqual(
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12,
            }
        )
    })

    test('of many blogs with identical values', () => {
        expect(listHelper.favoriteBlog(blogList))
        .toEqual(
            {
                title: "First class tests",
                author: "Robert C. Martin",
                likes: 16,
            }
        )
    })

})