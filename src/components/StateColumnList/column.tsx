import './style.scss';

import React from 'react';
import { Row, Col } from 'reactstrap';
import moment from 'moment-jalaali';

import n from 'n.png';
import folder from 'folder.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faKey } from '@fortawesome/free-solid-svg-icons';
import MenuTools from '../../utils/MenuTools/';
import { formatBytes } from '../../utils/index';
import { RightClick } from '../../utils';
import { downloadThumbnail } from '../../config/api';
// import Empty from './empty';
interface IProps {
  list: any;
  setHash: React.Dispatch<React.SetStateAction<string>>;
}

const Column: React.FunctionComponent<IProps> = ({ list = [], setHash }) => {
  return (
    <React.Fragment>
      <RightClick query='.m-4' />
      <Row className='m-4'>
        {list.map((item, index) => (
          <Col xs={3} md={3} lg={3} key={index}>
            <div
              onDoubleClick={() => {
                item.extension ? null : setHash(item.hash);
              }}
              className='col'
              style={item.extension ? {} : { cursor: 'pointer' }}
            >
              <div className='col__img-wrapper'>
                <div className='col__menu-wrapper'>
                  <MenuTools item={item} />
                </div>
                <div className='col__icon-access-wrapper'>
                  {item.isPublic ? (
                    <FontAwesomeIcon
                      className='col__icon-access'
                      icon={faGlobe}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className='col__icon-access'
                      icon={faKey}
                    />
                  )}
                </div>
                {/* {console.log("ddd ", downloadThumbnail(item.hash))} */}
                {item.extension ? (
                  item.thumbnail === 'THUMBNAIL_EXIST_PNG' ? (
                    <img
                      className='col__img'
                      src={`https://sandbox.podspace.ir:8443/api/files/${item.hash}/thumbnail`}
                      // src={}
                    />
                  ) : (
                    ''
                  )
                ) : (
                  <div className='col__folder-img-wrapper'>
                    <img className='col__folder-img' src={folder} />
                  </div>
                )}
              </div>
              <h4 className='col__title'>{item?.name}</h4>
              <div className='col__volume'>{formatBytes(item.size)}</div>
              <div className='col__date'>
                {moment(item.created).format('jYYYY/jMM/jDD HH:mm:ss')}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </React.Fragment>
  );
};

export default Column;
