import * as React from 'react';
import { IUser, IUploadFile, IConfigure, IMetaData, IBrokersPartitions } from 'types/base-type';
import { users } from 'store/users';
import { version } from 'store/version';
import { showApplyModal, showModifyModal, showConfigureModal } from 'container/modal/admin';
import { Popconfirm, Tooltip } from 'component/antd';
import { admin } from 'store/admin';
import { cellStyle } from 'constants/table';
import { timeFormat } from 'constants/strategy';
import { urlPrefix } from 'constants/left-menu';
import moment = require('moment');

export const getUserColumns = () => {
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: '35%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: '30%',
      render: (text: string, record: IUser) => {
        return (
          <span className="table-operation">
            <a onClick={() => showApplyModal(record)}>修改</a>
            <Popconfirm
              title="确定删除？"
              onConfirm={() => users.deleteUser(record.username)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>);
      },
    },
  ];
  return columns;
};

export const getVersionColumns = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string, record: IUploadFile) => {
        return (
          <Tooltip placement="topLeft" title={text} >
              <a href={`${urlPrefix}/info?fileId=${record.id}`} target="_blank">{text}</a>
          </Tooltip>);
      },
    }, {
      title: 'MD5',
      dataIndex: 'fileMd5',
      key: 'fileMd5',
      onCell: () => ({
        style: {
          maxWidth: 120,
          ...cellStyle,
        },
      }),
      render: (text: string) => {
        return (
          <Tooltip placement="bottomLeft" title={text} >
              {text.substring(0, 8)}
          </Tooltip>);
      },
    }, {
      title: '更新时间',
      dataIndex: 'gmtModify',
      key: 'gmtModify',
      render: (t: number) => moment(t).format(timeFormat),
    }, {
      title: '更新人',
      dataIndex: 'operator',
      key: 'operator',
    }, {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
      onCell: () => ({
        style: {
          maxWidth: 200,
          ...cellStyle,
        },
      }),
      render: (text: string) => {
        return (
          <Tooltip placement="topLeft" title={text} >
              {text}
          </Tooltip>);
      },
    }, {
      title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text: string, record: IUploadFile) => {
          return (
            <span className="table-operation">
              <a onClick={() => showModifyModal(record)}>修改</a>
              <Popconfirm
                title="确定删除？"
                onConfirm={() => version.deleteFile(record.id)}
              >
                <a>删除</a>
              </Popconfirm>
            </span>);
        },
      },
  ];
  return columns;
};

export const getConfigureColumns = () => {
  const columns = [
    {
      title: '配置键',
      dataIndex: 'configKey',
      key: 'configKey',
      width: '20%',
      sorter: (a: IConfigure, b: IConfigure) => a.configKey.charCodeAt(0) - b.configKey.charCodeAt(0),
    },
    {
      title: '配置值',
      dataIndex: 'configValue',
      key: 'configValue',
      width: '30%',
      sorter: (a: IConfigure, b: IConfigure) => a.configValue.charCodeAt(0) - b.configValue.charCodeAt(0),
      render: (t: string) => {
        return t.substr(0, 1) === '{' && t.substr(0, -1) === '}' ? JSON.stringify(JSON.parse(t), null, 4) : t;
      },
    },
    {
      title: '修改时间',
      dataIndex: 'gmtModify',
      key: 'gmtModify',
      width: '20%',
      sorter: (a: IConfigure, b: IConfigure) => b.gmtModify - a.gmtModify,
      render: (t: number) => moment(t).format(timeFormat),
    },
    {
      title: '描述信息',
      dataIndex: 'configDescription',
      key: 'configDescription',
      width: '20%',
      onCell: () => ({
        style: {
          maxWidth: 180,
          ...cellStyle,
        },
      }),
    },
    {
      title: '操作',
      width: '10%',
      render: (text: string, record: IConfigure) => {
        return (
          <span className="table-operation">
            <a onClick={() => showConfigureModal(record)}>修改</a>
            <Popconfirm
              title="确定删除？"
              onConfirm={() => admin.deleteConfigure(record.configKey)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>);
      },
    },
  ];
  return columns;
};

const  renderClusterHref = (value: number | string, item: IMetaData, key: number) => {
  return ( // 0 暂停监控--不可点击  1 监控中---可正常点击
    <>
    {item.status === 1 ? <a href={`${urlPrefix}/admin/cluster-detail?clusterId=${item.clusterId}#${key}`}>{value}</a>
      : <a style={{ cursor: 'not-allowed', color: '#999' }}>{value}</a>}
    </>
  );
};

export const getAdminClusterColumns = () => {
  return [
    {
      title: '集群ID',
      dataIndex: 'clusterId',
      key: 'clusterId',
      sorter: (a: IMetaData, b: IMetaData) => b.clusterId - a.clusterId,
    },
    {
      title: '集群名称',
      dataIndex: 'clusterName',
      key: 'clusterName',
      sorter: (a: IMetaData, b: IMetaData) => a.clusterName.charCodeAt(0) - b.clusterName.charCodeAt(0),
      render: (text: string, item: IMetaData) => renderClusterHref(text, item, 1),
    },
    {
      title: 'Topic数',
      dataIndex: 'topicNum',
      key: 'topicNum',
      sorter: (a: any, b: IMetaData) => b.topicNum - a.topicNum,
      render: (text: number, item: IMetaData) => renderClusterHref(text, item, 2),
    },
    {
      title: 'Broker数',
      dataIndex: 'brokerNum',
      key: 'brokerNum',
      sorter: (a: IMetaData, b: IMetaData) => b.brokerNum - a.brokerNum,
      render: (text: number, item: IMetaData) => renderClusterHref(text, item, 3),
    },
    {
      title: 'Consumer数',
      dataIndex: 'consumerGroupNum',
      key: 'consumerGroupNum',
      sorter: (a: IMetaData, b: IMetaData) => b.consumerGroupNum - a.consumerGroupNum,
      render: (text: number, item: IMetaData) => renderClusterHref(text, item, 4),
    },
    {
      title: 'Region数',
      dataIndex: 'regionNum',
      key: 'regionNum',
      sorter: (a: IMetaData, b: IMetaData) => b.regionNum - a.regionNum,
      render: (text: number, item: IMetaData) => renderClusterHref(text, item, 5),
    },
    {
      title: 'Controllerld',
      dataIndex: 'controllerId',
      key: 'controllerId',
      sorter: (a: IMetaData, b: IMetaData) => b.controllerId - a.controllerId,
      render: (text: number, item: IMetaData) => renderClusterHref(text, item, 7),
    },
    {
      title: '监控中',
      dataIndex: 'status',
      key: 'status',
      sorter: (a: IMetaData, b: IMetaData) => b.key - a.key,
      render: (value: number) => value === 1 ?
        <span className="success">是</span > : <span className="fail">否</span>,
    },
  ];
};

export const getPartitionInfoColumns = () => {
  return [{
    title: 'Topic',
    dataIndex: 'topicName',
    key: 'topicName',
    width: '21%',
    render: (val: string) => <Tooltip placement="bottomLeft" title={val}> {val} </Tooltip>,
  }, {
    title: 'Leader',
    dataIndex: 'leaderPartitionList',
    width: '20%',
    onCell: () => ({
      style: {
        maxWidth: 250,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        cursor: 'pointer',
      },
    }),
    render: (value: number[]) => {
      return (
        <Tooltip placement="bottomLeft" title={value.join('、')}>
          {value.map(i => <span key={i} className="p-params">{i}</span>)}
        </Tooltip>
      );
    },
  }, {
    title: '副本',
    dataIndex: 'followerPartitionIdList',
    width: '22%',
    onCell: () => ({
      style: {
        maxWidth: 250,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        cursor: 'pointer',
      },
    }),
    render: (value: number[]) => {
      return (
        <Tooltip placement="bottomLeft" title={value.join('、')}>
          {value.map(i => <span key={i} className="p-params">{i}</span>)}
        </Tooltip>
      );
    },
  }, {
    title: '未同步副本',
    dataIndex: 'notUnderReplicatedPartitionIdList',
    width: '22%',
    onCell: () => ({
      style: {
        maxWidth: 250,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        cursor: 'pointer',
      },
    }),
    render: (value: number[]) => {
      return (
        <Tooltip placement="bottomLeft" title={value.join('、')}>
          {value.map(i => <span key={i} className="p-params p-params-unFinished">{i}</span>)}
        </Tooltip>
      );
    },
  }];
};
