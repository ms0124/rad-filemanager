import styles from './style.module.scss';

import React, { useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
  Input,
  Row,
  Col,
  Button,
  ListGroup,
  ListGroupItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTimes,
  faCaretDown
} from '@fortawesome/free-solid-svg-icons';
// import {  } from '@fortawesome/free-regular-svg-icons';

import { getBs } from '../../utils/index';
import classNames from 'classnames';
import ListItem from './listItem';
import { IconCopy } from '../../utils/icons';

const ShareFile = ({ isOpen, toggle }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Modal
      cssModule={getBs()}
      isOpen={isOpen}
      toggle={toggle}
      size='lg'
      className={styles['sharefile-wrapper']}
    >
      <ModalHeader
        cssModule={getBs()}
        className={classNames(
          styles['sharefile-wrapper__header'],
          getBs()['border-bottom-0'],
          getBs()['d-flex']
        )}
      >
        <div
          className={classNames(
            getBs()['d-flex'],
            getBs()['justify-content-between'],
            getBs()['align-items-center']
          )}
        >
          <div>مدیریت اشتراک گذاری و دسترسی‌ها</div>
          <FontAwesomeIcon icon={faTimes} onClick={toggle} role='button' />
        </div>
      </ModalHeader>
      <ModalBody cssModule={getBs()}>
        <Row cssModule={getBs()}>
          <Col cssModule={getBs()} xs={12}>
            <div>افرادی که دسترسی دارند</div>
            <br />
          </Col>
        </Row>
        <Row cssModule={getBs()} className={classNames(getBs()['mb-3'])}>
          <Col cssModule={getBs()} xs={12}>
            <div className={styles['sharefile-wrapper__add']}>
              <Input
                cssModule={getBs()}
                placeholder='شماره موبایل، نام کاربری، ایمیل'
              />
              <Input
                cssModule={getBs()}
                placeholder='تاریخ انقضا اشتراک گذاری'
              />
              <Button cssModule={getBs()}>
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
          </Col>
        </Row>
        <Row cssModule={getBs()}>
          <Col cssModule={getBs()} xs={12} className={classNames()}>
            <div className={classNames(getBs()['border'], getBs()['rounded'])}>
              <ListGroup
                cssModule={getBs()}
                className={classNames(getBs()['pr-0'], styles['list-wrapper'])}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
                  <ListGroupItem
                    cssModule={getBs()}
                    className={classNames(
                      getBs()['border-left-0'],
                      getBs()['border-right-0']
                    )}
                  >
                    <ListItem name={'مسلم'} img={undefined} date={undefined} />
                  </ListGroupItem>
                ))}
              </ListGroup>
            </div>
          </Col>
        </Row>
        <Row cssModule={getBs()}>
          <Col cssModule={getBs()} xs={12}>
            <Dropdown
              cssModule={getBs()}
              isOpen={dropdownOpen}
              toggle={() => setDropdownOpen((prev) => !prev)}
            >
              44
              <DropdownToggle
                cssModule={getBs()}
                data-toggle='dropdown'
                tag={'span'}
              >
                <FontAwesomeIcon icon={faCaretDown} />
              </DropdownToggle>
              <DropdownMenu cssModule={getBs()}>
                <DropdownItem cssModule={getBs()}>1</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
          <Col
            cssModule={getBs()}
            xs={12}
            className={classNames(getBs()['mt-3'])}
          >
            <div
              className={classNames(
                getBs()['d-flex'],
                getBs()['justify-content-between']
              )}
            >
              <Button
                cssModule={getBs()}
                outline
                className={styles['sharefile-wrapper__copy']}
              >
                <IconCopy />
                <span className={getBs()['mr-3']}>کپی لینک</span>
              </Button>
              <Button
                cssModule={getBs()}
                className={styles['sharefile-wrapper__confirm']}
              >
                <span className={classNames(getBs()['ml-2'], getBs()['mr-2'])}>
                  تایید
                </span>
              </Button>
            </div>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default ShareFile;
