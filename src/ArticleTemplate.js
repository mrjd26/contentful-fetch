import React from 'react';
import { AppBar, CircularProgress, CssBaseline, Toolbar, Typography, Container} from "@material-ui/core";
import useContentful from './hooks/use-contentful.js';
import { makeStyles } from '@material-ui/core/styles';
import { BLOCKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga';


ReactGA.initialize('UA-84755207-2');
ReactGA.pageview(window.location.pathname + window.location.search);

const classes = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
}));

function Template() {
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
    marginRight: "auto"
  };

    const richTextOptions = {
        renderNode: {
            [BLOCKS.EMBEDDED_ASSET]: (node) => {
                if (node.nodeType === "embedded-asset-block") {
                    console.log(count);
                    count++;
                    return <img
                             src={data.postCollection.items[0].content.links.assets.block[count - 1].url}
                             alt={data.postCollection.items[0].content.links.assets.block[count - 1].description}
                             style={imageStyle}
                           />

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

                 <Typography component="div" style={{backgroundColor: '#cfe8fc'}} >
                     { data ? (
                     <div>
                         <img id="top-image" alt={data.postCollection.items[0].image.description}
                              src={data.postCollection.items[0].image.url}
                              style={imageStyle}
                         />
                         {documentToReactComponents(data.postCollection.items[0].content.json, richTextOptions)}
                         <Helmet>
                             <title>{data.postCollection.items[0].title}</title>
                             <meta name="description" content={ "Title: " + data.postCollection.items[0].title} />
                         </Helmet>
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
