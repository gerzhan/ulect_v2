/**
 * Lecture.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        author: {
            type: "string",
        },
        slideshareId: {
            type: "string",
            defaultsTo: "42152411"
        },        
        slideshareUrl: {
            type: "string",
            defaultsTo: "//www.slideshare.net/slideshow/embed_code/42152411"
        },
        slideId: {
            type: "string"
        },
        slides: {
            type: "array"
        }
        ,
        course:{ 
            model: 'Course',
            //required: true,
            //defaultsTo: 0
        }
    }
};

