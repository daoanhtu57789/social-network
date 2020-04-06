import React, { Component } from "react";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CommentIcon from "@material-ui/icons/Comment";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import LockIcon from "@material-ui/icons/Lock";
//css
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
//chuyển đổi giờ
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
//check dữ liệu nhận vào
import propTypes from "prop-types";
class News extends Component {
  state = {
    expanded: false,
    anchorEl: null,
    isMenuOpen: false,
  };

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      isMenuOpen: true,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      isMenuOpen: false,
    });
  };
  handleExpandClick = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };
  //Xóa bài viết
  onClickDelete = () => {
    const { onClickDelete } = this.props;
    onClickDelete();
    this.handleClose();
  };

  //Sửa bài viết
  onClickEdit = () => {
    const { onClickEdit } = this.props;
    onClickEdit();
    this.handleClose();
  };
  render() {
    dayjs.extend(relativeTime);
    const { classes, news, onClickLike, onClickUnLike, color } = this.props;
    const { expanded } = this.state;

    return (
      <Card className={classes.root}>
        <CardHeader
          avatar={<Avatar src={news.avatar} />}
          action={
            news.email === localStorage.getItem("user") ? (
              <div>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={this.handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={this.state.anchorEl}
                  keepMounted
                  open={this.state.isMenuOpen}
                  onClose={this.handleClose}
                  PaperProps={{
                    style: {
                      width: "20ch",
                      marginLeft: "7ch",
                    },
                  }}
                >
                  <MenuItem onClick={this.onClickEdit}>
                    Sửa Bài Viết <EditIcon fontSize="small" />{" "}
                  </MenuItem>
                  <MenuItem onClick={this.onClickDelete}>
                    Xóa Bài Viết <DeleteIcon fontSize="small" />
                  </MenuItem>
                  <MenuItem onClick={this.handleClose}>
                    Chỉ Mình Tôi <LockIcon fontSize="small" />
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <div></div>
            )
          }
          title={news.nameUser}
          subheader={dayjs(news.createdAt).fromNow()}
        />

        <CardContent>
          <strong>{news.content}</strong>
        </CardContent>

        {news.image.length > 1 ? (
          <img style={{ width:'100%',height:'50%'}} className={classes.media} alt="" src={news.image} />
        ) : (
          ""
        )}

        <CardActions disableSpacing>
          <IconButton
            aria-label="add to favorites"
            color={color}
            onClick={
              color === "default"
                ? () => onClickLike(news)
                : () => onClickUnLike(news)
            }
          >
            <FavoriteIcon /> {news.likeCount}
          </IconButton>
          <IconButton aria-label="add to comment">
            <CommentIcon /> {news.commentCount}
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon /> {news.shareCount}
          </IconButton>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
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
}

News.propTypes = {
  classes: propTypes.object,
  news: propTypes.object,
  handleLike: propTypes.func,
};

export default withStyles(styles)(News);
