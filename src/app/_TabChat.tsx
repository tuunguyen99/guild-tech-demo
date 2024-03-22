"use client";
import { Form, Input, Button, List, Tag, Tooltip } from "antd";
import { Comment } from "@ant-design/compatible";
import moment from "moment";
import { useEffect, useState } from "react";

const Editor = ({ onChange, onSubmit, submitting, value }: any) => (
  <>
    <Form.Item>
      <Input.TextArea autoFocus rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Send Message
      </Button>
    </Form.Item>
  </>
);

export default function TabChat(props: any) {
  const { guildTechCore } = props;
  const [list, setList] = useState<any>([]);

  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState("");

  const handleSubmit = async () => {
    if (!value) return;

    setSubmitting(true);
    // call send message
    // call update list

    setSubmitting(false);
    setValue("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const getGuildChatHistory = async () => {
    if (guildTechCore) {
      const res = await guildTechCore.getGuildChatHistory({
        page: 1,
        limit: 100,
      });
      setList(res);
    }
  };

  useEffect(() => {
    if (guildTechCore.userGuild?.address) {
      getGuildChatHistory();
    }
  }, [guildTechCore]);

  return (
    <List
      className="comment-list"
      itemLayout="horizontal"
      dataSource={list?.data
        ?.map((item: any) => {
          let name = item.user?.username;
          if (item.user?.firstName && item.user?.lastName) {
            name = `${item.user?.firstName} ${item.user?.lastName}`;
          }
          return {
            author: <>{name}</>,
            content: <p>{item.content}</p>,
            datetime: (
              <Tooltip
                title={moment(item.createdAt).format("HH:mm DD/MM/YYYY")}
              >
                <span>{moment(item.createdAt).fromNow()}</span>
              </Tooltip>
            ),
          };
        })
        .reverse()}
      renderItem={(item: any) => (
        <li>
          <Comment
            author={item.author}
            content={item.content}
            datetime={item.datetime}
          />
        </li>
      )}
      footer={
        <Comment
          content={
            <Editor
              onChange={handleChange}
              onSubmit={handleSubmit}
              submitting={submitting}
              value={value}
            />
          }
        />
      }
    />
  );
}
