import React, { Component, useState, useEffect } from 'react';
import { AppBar, CircularProgress, CssBaseline, Toolbar, Typography, Container} from "@material-ui/core";
import useContentful from './hooks/use-contentful.js';
import CommentIcon from '@material-ui/icons/Comment';
import { makeStyles } from '@material-ui/core/styles';
import { BLOCKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga';
import { DiscussionEmbed } from 'disqus-react';
import { HashLink } from 'react-router-hash-link';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

ReactGA.initialize('UA-84755207-2');
ReactGA.pageview(window.location.pathname + window.location.search);

const baseUrl = 'https://www.mike-jarvis.com/'

function cleanTimestamp(unix_ts) {
    let date = new Date(unix_ts);
    return date.toDateString();
}

const classes = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
}));

const images = [];

function Template() {

     const [isOpen, setIsOpen ] = useState(false);
     const [photoIndex, setPhotoIndex] = useState(0);

      let { article } = useParams();
      let query = `
    query($variable_name: String) {
      postCollection(limit:10, where:{slug:$variable_name}) {
        items {
          sys {
            id
            firstPublishedAt
          }
          slug
          title
          image {
            url(transform: {
                         
                           resizeStrategy: SCALE width:300
                         
                       })
          }
          subtitle
          content {
            json
            links {
                      assets {
                        block {
                          title
                          description
                          contentType
                          fileName
                          size
                          url
                          width
                          height
                        }
                      }
                    }     
          }
          contentfulMetadata {
            tags {
              id
              name
            }
          }
        }
      }
    }
    `

      const variables = {"variable_name": article};
      let {data, errors} = useContentful(query, variables) ;

      var count = 0;

      const imageStyle = {
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: "100%"
      };
      let images = [];

      const richTextOptions = {
          renderNode: {
              [BLOCKS.EMBEDDED_ASSET]: (node) => {
                  if (node.nodeType === "embedded-asset-block") {
                      count++;
                      images.push(data.postCollection.items[0].content.links.assets.block[count-1].url);
                      return (
                              <img
                                  count={count-1}
                                  onClick={(e) => {
                                      setIsOpen(true)
                                      setPhotoIndex(e.target.getAttribute('count'))
                                    }
                                  }

                                  src={data.postCollection.items[0].content.links.assets.block[count - 1].url}
                                  alt={data.postCollection.items[0].content.links.assets.block[count - 1].description}
                                  id={data.postCollection.items[0].content.links.assets.block[count-1].title}
                                  style={imageStyle}
                              />

                      )

                  } else {
                      return <span style={{backgroundColor: 'red', color: 'white'}}> Embedded asset </span>
                  }
              }
          }
      }
            return (
                <React.Fragment>
                    <CssBaseline/>
                    <AppBar position="relative">
                        <Toolbar>
                            <Typography variant="h6" color="inherit" noWrap>
                                <Link to="/">Home</Link>
                                <Link style={{marginLeft: 55}} to="/about">About</Link>
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    <div className={classes.heroContent}>
                        <Container maxWidth="sm">

                            <Typography component="div" style={{backgroundColor: '#cfe8fc'}}>
                                {data ? (
                                    <div>
                                        <img id="top-image" alt={data.postCollection.items[0].image.description}
                                             src={data.postCollection.items[0].image.url}
                                             style={imageStyle}
                                        />
                                        <br/>
                                        <HashLink smooth to="#disqus_thread">
                                            <CommentIcon></CommentIcon>Comment
                                        </HashLink> {"           "}
                                        <span style={{marginLeft: 20, fontSize: "0.75rem"}}>
                             <em>{cleanTimestamp(data.postCollection.items[0].sys.firstPublishedAt)}</em>
                         </span>

                                        {documentToReactComponents(data.postCollection.items[0].content.json, richTextOptions)},

                                        { isOpen && (
                                            <Lightbox
                                                mainSrc={images[photoIndex]}
                                                onCloseRequest={() => setIsOpen(false)}
                                            />
                                        )
                                    }
                                        <Helmet>
                                            <title>{data.postCollection.items[0].title}</title>
                                            <meta name="description"
                                                  content={"Title: " + data.postCollection.items[0].title + "Subtitle: " + data.postCollection.items[0].subtitle}/>
                                        </Helmet>
                                        <DiscussionEmbed
                                            shortname='mike-jarvis'
                                            config={
                                                {
                                                    url: baseUrl + data.postCollection.items[0].slug,
                                                    identifier: data.postCollection.items[0].sys.id,
                                                    title: data.postCollection.items[0].title,
                                                    language: 'en'
                                                }
                                            }
                                        />
                                    </div>
                                ) : (
                                    <div>`...Loading {article}`
                                        <CircularProgress/>
                                    </div>
                                )
                                }
                            </Typography>

                        </Container>
                    </div>
                </React.Fragment>
            );
}

export default Template;