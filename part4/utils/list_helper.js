const _=require('lodash')

const dummy=(blogs)=>{
    return 1
}

const totalLikes=(blogs)=>{
    if (blogs.length===0){
    return 0}
    const likes=blogs.reduce((sum, blog)=>sum+blog.likes,0)
    console.log(blogs[0].likes)
    return likes
}

const favoriteBlog=(blogs)=>{
    if(blogs.length===0){
        return
    }
    const maxLikes=Math.max(...blogs.map((blog)=>blog.likes))
    const result= blogs.find((blog)=>blog.likes===maxLikes)
    delete result._id
    delete result.__v
    delete result.url
    return result
}


//not finished
const mostBlogs=(blogs)=>{
    if(blogs.length===0){return}
    var authors={}
    blogs.forEach(blog => {
        if(blog.author in authors){
            authors[blog.author]+=1
        }
        else{
            authors[blog.author]=1
        }
    });
    const max=Math.max(authors)
    return authors[-1]
}


module.exports={dummy, totalLikes, favoriteBlog, mostBlogs}
