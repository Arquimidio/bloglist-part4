const listHelper = require('../utils/list_helper')
const blogList = require('./blogList')

describe('most blogs', () => {

    test('of empty blog list, returns the correct result', () => {
        expect(listHelper.mostBlogs([]))
        .toEqual(
            {
                author: null,
                blogs: 0
            }
        )
    })
    
    test('of one blog equals this one author and blog count', () => {
        expect(listHelper.mostBlogs([blogList[0]]))
        .toEqual(
            {
                author: "Michael Chan",
                blogs: 1
            }
        )
    })

    test('of some containing identical blog counts returns one author with most blogs and his blog count', () => {
        expect(listHelper.mostBlogs(blogList.slice(0, 5)))
        .toEqual(
            {
                author: "Edsger W. Dijkstra",
                blogs: 2
            }
        )
    })

    test('of many distinct counts, returns the only correct result', () => {
        expect(listHelper.mostBlogs(blogList))
        .toEqual(
            {
                author: "Robert C. Martin",
                blogs: 3
            }
        )
    })

})