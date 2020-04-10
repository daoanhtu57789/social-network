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
import SendIcon from "@material-ui/icons/Send";
//css
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
//chuyển đổi giờ
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
//check dữ liệu nhận vào
import propTypes from "prop-types";
import { Grid, Button, InputBase } from "@material-ui/core";
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
  //bắt sự kiện khi nhập vào comment
  handleChangeComment = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      isMenuOpen: false,
    });
  };
  handleExpandClick = () => {
    const { fetchComment } = this.props;
    this.setState({
      expanded: !this.state.expanded,
    });
    fetchComment();
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
  //function lấy 6 kí tự đầu của tên
  renderNameUser = (name) => {
    var newName = "";
    var arrayName = name.split(" ");
    newName = arrayName[0];
    return newName;
  };

  //showComment
  renderComment = () => {
    dayjs.extend(relativeTime);
    const { expanded } = this.state;
    const { classes, sendComment, news, commentList } = this.props;
    let xhtml = null;
    if (expanded) {
      xhtml = (
        <CardContent>
          <Grid
            container
            direction="column"
            justify="flex-end"
            alignItems="stretch"
          >
            <Grid item className={classes.line}></Grid>
            <Grid item>
              <strong>Bình Luận</strong>
            </Grid>
            {commentList.length > 0
              ? commentList.map((comment,index) => {
                  return (
                    <Grid item key={index}>
                      <Grid container style={{ margin: "10px 0 10px 0px" }}>
                        <Grid
                          item
                          md={1}
                          xs={12}
                          style={{ margin: "1.3em 0 0 0" }}
                        >
                          <Avatar src={comment.avatar} />
                        </Grid>
                        <Grid
                          item
                          md={11}
                          xs={12}
                          style={{ marginTop: " 12px" }}
                        >
                          <strong>{this.renderNameUser(comment.commentUserName)}</strong>
                          <strong style={{marginLeft:'20em'}}>{dayjs(comment.createdAt).fromNow()}</strong>
                          <div className={classes.comment}>
                            {comment.comment}
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })
              : ""}
            <Grid item style={{ height: "3em" }}>
              <div className={classes.input}>
                <InputBase
                  multiline
                  id="comment"
                  type="text"
                  name="comment"
                  onChange={this.handleChangeComment}
                  style={{ margin: "0 0 0.3em 0.3em", width: "24.1em" }}
                />
                <Button className={classes.button}>
                  <SendIcon
                    color="primary"
                    onClick={() => sendComment(this.state.comment, news)}
                  />
                </Button>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      );
    }
    return xhtml;
  };

  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      news,
      onClickLike,
      onClickUnLike,
      color,
      onOpenFriendProfile,
    } = this.props;
    const { expanded } = this.state;
    return (
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar src={news.avatar} onClick={() => onOpenFriendProfile()} />
          }
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
          title={
            <strong onClick={() => onOpenFriendProfile()}>
              {news.nameUser}
            </strong>
          }
          subheader={dayjs(news.createdAt).fromNow()}
        />

        <CardContent>
          <strong>{news.content}</strong>
        </CardContent>

        {news.image.length > 1 ? (
          <img
            style={{ width: "100%", height: "50%" }}
            className={classes.media}
            alt=""
            src={news.image}
          />
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
            onClick={() => this.handleExpandClick(news)}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        {this.renderComment()}
      </Card>
    );
  }
}

News.propTypes = {
  classes: propTypes.object,
  news: propTypes.object,
  onClickLike: propTypes.func,
  onClickUnLike: propTypes.func,
  color: propTypes.string,
  onClickDelete: propTypes.func,
  onClickEdit: propTypes.func,
  sendComment: propTypes.func,
};

export default withStyles(styles)(News);
