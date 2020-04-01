import React, { Component } from "react";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CommentIcon from '@material-ui/icons/Comment';
//css
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
//check dữ liệu nhận vào
import propTypes from 'prop-types';
class News extends Component {
  state = {
    expanded: false
  };
  handleExpandClick = () => {
    this.setState({
      expanded: !this.state.expanded
    });
  };
  render() {
    const { classes,news } = this.props;
    const { expanded } = this.state;
    return (
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar
                src={news.image}
            />
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={news.nameUser}
          subheader={news.createdAt}
        />
        <CardMedia
          className={classes.media}
          image="/static/images/cards/paella.jpg"
          title="Paella dish"
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {news.content}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon /> {news.likeCount}
          </IconButton>
          <IconButton aria-label="add to comment">
            <CommentIcon /> 
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon /> {news.shareCount}
          </IconButton>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded
            })}
            onClick={() => this.handleExpandClick()}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
};

News.propTypes = {
  classes : propTypes.object,
  news : propTypes.object
}

export default withStyles(styles)(News);
