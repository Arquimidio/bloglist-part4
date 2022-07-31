const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sumOfLikes, { likes }) => sumOfLikes + likes
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const maxLikes = Math.max(...blogs.map(({ likes }) => likes))
    const { title, author, likes } = blogs.find(blog => blog.likes === maxLikes)
    return { title, author, likes }
}

const mostBlogs = (blogs) => {
    const reducer = (authors, curBlog) => {
        authors[curBlog.author] = ( authors[curBlog.author] || 0 ) + 1
        return authors
    }

    const blogCount = blogs.reduce(reducer, { })

    let maxBlogsAuthor;
    let maxBlogs = 0;
    for(let author in blogCount){
        if(blogCount[author] > maxBlogs){
            maxBlogsAuthor = author
            maxBlogs = blogCount[author]
        }
    }

    return { author: (maxBlogsAuthor || null), blogs: maxBlogs }
}

const mostLikes = (blogs) => {
    const reducer = (totalAuthorLikes, curBlog) => {
        totalAuthorLikes[curBlog.author] = (totalAuthorLikes[curBlog.author] || 0) + curBlog.likes
        return totalAuthorLikes
    }

    const totalAuthorsLikes = blogs.reduce(reducer, { })
    console.log(totalAuthorsLikes)
    let mostLikedAuthor;
    let likeCount = 0;
    for(let author in totalAuthorsLikes){
        if(totalAuthorsLikes[author] > likeCount){
            likeCount = totalAuthorsLikes[author]
            mostLikedAuthor = author
        }
    }

    return { author: (mostLikedAuthor || null), likes: likeCount }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}