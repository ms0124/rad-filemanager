import styles from './style.module.scss';
import { DatePicker } from 'react-persian-datepicker-rad';
import React, { useState, useContext } from 'react';
import copy from 'copy-to-clipboard';
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
  DropdownToggle,
  Spinner
} from 'reactstrap';
import moment from 'moment-jalaali';
import { Context } from '../../store/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTimes,
  faCaretDown,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons';

// hooks
import {
  useDetailShare,
  useAddShare,
  useDeleteShare,
  useAddPublic,
  useRemovePublic,
  useOnClickOutside
} from '../../config/hooks';
import { getBs } from '../../utils/index';
import classNames from 'classnames';
import ListItem from './listItem';
import { IconCopy } from '../../utils/icons';
import { toast } from 'react-toastify';
import cs from './basic.css';

interface IProps {
  hash: string;
  isOpen: boolean;
  toggle: () => void;
  isPublic: boolean;
}

const styleCalendar = {
  currentMonth: cs['currentMonth'],
  calendarContainer: classNames(cs['calendarContainer']),
  dayPickerContainer: cs['dayPickerContainer'],
  monthsList: cs['monthsList'],
  daysOfWeek: cs['daysOfWeek'],
  dayWrapper: cs['dayWrapper'],
  selected: cs['selected'],
  heading: cs['heading'],
  next: cs['next'],
  prev: cs['prev'],
  title: cs['title']
};

const ShareFile: React.FC<IProps> = ({ isOpen, toggle, hash, isPublic }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [identity, setIdentity] = useState<string>('');
  const [date, setDate] = useState<any>();
  const { isSandbox } = useContext(Context);

  const [isAccessPublic, setIsAccessPublic] = useState<boolean>(
    isPublic ? true : false
  );
  // const { selectedItems, itemHash } = useContext(Context);
  const {
    data: dataShare,
    isLoading,
    refetch,
    isFetching
  }: any = useDetailShare(hash);
  const addShare = useAddShare();
  const deleteShare = useDeleteShare();

  const addPublic = useAddPublic();
  const removePublic = useRemovePublic();

  const accessHandler = () => {
    setIsAccessPublic((prevAccess) => !prevAccess);
  };
  const identityHandler = (event) => {
    const { value } = event.target;
    setIdentity(value);
  };

  const addShareHandller = () => {
    if (!date) return;
    const params = { expiration: date.format('YYYY/MM/DD'), level: 'VIEW' };
    addShare.mutateAsync({ hash, identity, params }).then((res) => {
      const { hasError } = res;
      if (!hasError) {
        refetch();
        setIdentity('');
      }
    });
  };

  const deleteShareHandler = (identity) => {
    const params = { identityType: 'username' };
    deleteShare.mutateAsync({ hash, identity, params }).then((res) => {
      const { hasError } = res;
      if (!hasError) refetch();
    });
  };
  const copyHandler = () => {
    const baseUrl = isSandbox
      ? `https://podspace.sandpod.ir/api/files`
      : `https://podspace.pod.ir/api/files`;
    const isSuccess = copy(`${baseUrl}/${hash}?dl=1`);
    if (isSuccess) toast.success('لینک با موفقیت کپی شد.');
  };

  const confirmationHandler = () => {
    const { result } = dataShare;
    let hashShare: string = '';

    if (result && Array.isArray(result) && Array.isArray(result[0])) {
      const tmp = result[0][0] as any;
      hashShare = tmp?.hash;
    }

    if (isPublic == isAccessPublic) {
      // access configuraiotn not changed
      toggle();
    } else {
      if (!isAccessPublic) {
        removePublic.mutateAsync({ hash: hashShare }).then((res) => {
          const { hasError } = res;
          if (!hasError) {
            toast.success('دسترسی با موفقیت تغیر کرد.');
            toggle();
          }
        });
      } else if (isAccessPublic) {
        const params = { expiration: '2034/03/01' };
        addPublic.mutateAsync({ hash, params }).then((res) => {
          const { hasError } = res;
          if (!hasError) {
            toast.success('دسترسی با موفقیت تغیر کرد.');
            toggle();
          }
        });
      }
    }
  };

  return (
    <Modal
      cssModule={getBs()}
      isOpen={isOpen}
      toggle={toggle}
      size='lg'
      className={styles['sharefile-wrapper']}
      onClick={(event) => {
        event.stopPropagation();
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
      }}
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
                value={identity}
                onChange={identityHandler}
              />
              <div>
                {/* <Input
                  cssModule={getBs()}
                  placeholder='تاریخ انقضا اشتراک گذاری'
                /> */}
                <DatePicker
                  calendarStyles={styleCalendar}
                  value={date}
                  className={classNames(getBs()['form-control'])}
                  placeholder='تاریخ انقضا اشتراک گذاری'
                  min={moment()}
                  onFocus={() => {
                    setTimeout(() => {
                      const el = document.querySelector(
                        '.tether-element'
                      ) as HTMLDivElement;
                      if (el) {
                        el!.style!.zIndex = '10000';
                      }
                    }, 100);
                  }}
                  onChange={(value) => {
                    setDate(value);
                  }}
                  // calendarContainer={}
                />
              </div>
              <Button
                cssModule={getBs()}
                tag={'a'}
                className={classNames(styles['sharefile-wrapper__button'])}
                onClick={addShareHandller}
                disabled={!identity || !date}
              >
                <FontAwesomeIcon
                  icon={addShare.isLoading ? faCircleNotch : faPlus}
                  className={classNames({ 'fa-spin': addShare.isLoading })}
                />
              </Button>
            </div>
          </Col>
        </Row>
        <Row cssModule={getBs()}>
          <Col cssModule={getBs()} xs={12} className={classNames()}>
            {isLoading ? (
              <div
                className={classNames(
                  getBs()['d-flex'],
                  getBs()['justify-content-center']
                )}
              >
                <Spinner cssModule={getBs()} color='primary' size={'lg'} />
              </div>
            ) : (
              <>
                {dataShare?.result[0]?.length > 0 ? (
                  <div
                    className={classNames(
                      getBs()['border'],
                      getBs()['rounded']
                    )}
                  >
                    <ListGroup
                      cssModule={getBs()}
                      className={classNames(
                        getBs()['pr-0'],
                        styles['list-wrapper']
                      )}
                    >
                      {dataShare?.result[0]?.map((item, index) => {
                        if (item.type === 'PUBLIC') {
                          return null;
                        }
                        return (
                          <ListGroupItem
                            key={index}
                            cssModule={getBs()}
                            className={classNames(
                              getBs()['border-left-0'],
                              getBs()['border-right-0']
                            )}
                          >
                            <ListItem
                              name={item?.person?.username}
                              img={item?.person?.avatar}
                              date={item?.expiration}
                              deleteShareHandler={deleteShareHandler}
                              isLoading={deleteShare.isLoading}
                            />
                          </ListGroupItem>
                        );
                      })}
                    </ListGroup>
                  </div>
                ) : (
                  ''
                )}
              </>
            )}
          </Col>
        </Row>
        <Row cssModule={getBs()}>
          <Col cssModule={getBs()} xs={12}>
            <Dropdown
              cssModule={getBs()}
              isOpen={dropdownOpen}
              className={classNames(getBs()['pt-3'])}
              role='button'
              toggle={() => setDropdownOpen((prev) => !prev)}
            >
              <DropdownToggle
                cssModule={getBs()}
                data-toggle='dropdown'
                tag={'span'}
                className={classNames(
                  styles['sharefile-wrapper__dropdown-access']
                )}
              >
                {isAccessPublic ? 'دسترسی عمومی' : 'دسترسی محدود'}
                <FontAwesomeIcon
                  icon={faCaretDown}
                  className={classNames(getBs()['pr-2'], styles['sharefile-wrapper__dropdown-icon'])}

                />
              </DropdownToggle>
              <DropdownMenu
                cssModule={getBs()}
                right
                style={{ padding: 0, minWidth: '120px', textAlign: 'center' }}
              >
                <DropdownItem
                  cssModule={getBs()}
                  onClick={accessHandler}
                  style={{ padding: 0 }}
                >
                  {!isAccessPublic ? 'دسترسی عمومی' : 'دسترسی محدود'}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <div
              className={classNames(
                styles['sharefile-wrapper__guide'],
                getBs()['pt-2']
              )}
            >
              {isAccessPublic
                ? 'با توجه به این‌که فایل یا فولدر به صورت عمومی اشتراک‌گذاری شده است، همه افرادی که به لینک دانلود دسترسی داشته باشند، امکان دریافت و مشاهده فایل را خواهند داشت.'
                : 'با توجه به این‌که اشتراک‌گذاری فایل یا فولدر در وضعیت محدود است، فقط افرادی که در لیست بالا قرار دارند و فایل با آن‌ها اشتراک‌گذاری شده است، امکان دریافت و مشاهده فایل را خواهند داشت.'}
            </div>
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
                tag='a'
                className={styles['sharefile-wrapper__copy']}
                onClick={copyHandler}
              >
                <IconCopy />
                <span className={getBs()['mr-3']}>کپی لینک</span>
              </Button>
              <Button
                cssModule={getBs()}
                tag='a'
                className={classNames(
                  styles['sharefile-wrapper__confirm'],
                  styles['sharefile-wrapper__button']
                )}
                onClick={confirmationHandler}
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
