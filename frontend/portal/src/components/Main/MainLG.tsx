import ActiveLink from '@components/ActiveLink'
import CustomSwiper from '@components/CustomSwiper'
import { LOAD_IMAGE_URL } from '@constants'
import { ASSET_PATH, SERVER_API_URL } from '@constants/env'
import { convertStringToDateFormat } from '@libs/date'
import { IBoard, IMainItem } from '@service'
import { userAtom } from '@stores'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { SwiperSlide } from 'swiper/react'
import { bannerTypeCodes, MainProps } from '.'

interface MainLGProps extends MainProps {
  reserveItems: IMainItem
}

const MainLG = (props: MainLGProps) => {
  const { banners, boards, reserveItems } = props
  const router = useRouter()

  const user = useRecoilValue(userAtom)
  const { enqueueSnackbar } = useSnackbar()

  const [activeNotice, setActiveNotice] = useState<number>(
    Number(Object.keys(boards)[0]),
  )
  const [activeBoard, setActiveBoard] = useState<number>(
    Number(Object.keys(boards)[2]),
  )
  const [notice, setNotice] = useState(undefined)
  const [board, setBoard] = useState(undefined)

  const [mainBanners, setMainBanners] = useState(undefined)
  const [items, setItems] = useState(undefined)
  const [activeItem, setAcitveItem] = useState<string>(
    Object.keys(reserveItems)[0],
  )

  //예약 물품
  useEffect(() => {
    if (reserveItems) {
      const active = reserveItems[activeItem]
      setItems(
        active?.map(reserveItem => (
          <SwiperSlide key={`reserve-item-${reserveItem.reserveItemId}`}>
            <h5>{reserveItem.categoryName}</h5>
            <dl>
              <dt>예약서비스</dt>
              <dd>{reserveItem.reserveItemName}</dd>
              <p>{`${convertStringToDateFormat(
                reserveItem.startDate,
                'yyyy-MM-dd',
              )} ~ ${convertStringToDateFormat(
                reserveItem.endDate,
                'yyyy-MM-dd',
              )}`}</p>
              <ActiveLink
                handleActiveLinkClick={() => {
                  if (!reserveItem.isPossible) {
                    return
                  }

                  if (user == null) {
                    enqueueSnackbar('로그인이 필요합니다.', {
                      variant: 'warning',
                    })
                    return
                  }

                  router.push(
                    `/reserve/${reserveItem.categoryId}/${reserveItem.reserveItemId}`,
                  )
                }}
                className={reserveItem.isPossible ? 'possible' : ''}
                href="#"
              >
                {reserveItem.isPossible ? '예약 가능' : '예약 불가'}
              </ActiveLink>
            </dl>
          </SwiperSlide>
        )),
      )
    }
  }, [reserveItems, activeItem])

  // 메인 배너
  useEffect(() => {
    if (banners) {
      setMainBanners(
        banners[bannerTypeCodes[0]]?.map((b, i) => {
          return (
            <SwiperSlide
              key={`main-banner-${b.bannerNo}`}
              style={{
                backgroundImage: `url(${SERVER_API_URL}${LOAD_IMAGE_URL}${b.uniqueId})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="slide-title">
                <p>{b.bannerTitle}</p>
              </div>
              <div className="slide-content">
                <p>{b.bannerContent}</p>
              </div>
              <a
                href={b.urlAddr}
                target={b.newWindowAt ? '_blank' : '_self'}
                rel="noreferrer"
              >
                더보기
              </a>
            </SwiperSlide>
          )
        }),
      )
    }
  }, [banners])

  //boards
  useEffect(() => {
    if (boards) {
      const active = boards[activeBoard]
      setBoard(drawDivs(active))
    }
  }, [boards, activeBoard])

  useEffect(() => {
    if (boards) {
      const active = boards[activeNotice]
      setNotice(drawDivs(active))
    }
  }, [boards, activeNotice])

  //board 아이템 draw
  const drawDivs = useCallback(
    (board: IBoard) => {
      return (
        board && (
          <div key={`board-div-${board.boardNo}`}>
            {board.posts?.map(post => (
              <dl key={`posts-dl-${post.postsNo}`}>
                <dt>
                  <ActiveLink
                    href={`/board/${board.skinTypeCode}/${board.boardNo}/view/${post.postsNo}`}
                  >
                    {post.isNew ? <span className="newIcon">NEW</span> : null}
                    {post.postsTitle}
                  </ActiveLink>
                </dt>
                <dd>
                  <span>
                    {convertStringToDateFormat(post.createdDate, 'yyyy-MM-dd')}
                  </span>
                </dd>
              </dl>
            ))}
            <ActiveLink
              key={`board-more-${board.boardNo}`}
              href={`/board/${board.skinTypeCode}/${board.boardNo}`}
            >
              더보기
            </ActiveLink>
          </div>
        )
      )
    },
    [boards, activeBoard, activeNotice],
  )

  // 게시판 목록 draw
  const drawBoardList = () => {
    const boardNos = Object.keys(boards)

    let ul = []
    let children = []
    boardNos.map((no, idx) => {
      const title = React.createElement(
        'h4',
        {
          key: `notice-h4-${no}`,
          className:
            Number(no) === activeBoard || Number(no) === activeNotice
              ? 'on'
              : '',
          onClick: () => {
            handleBoardClick(Number(no))
          },
        },
        boards[no].boardName,
      )

      children.push(
        React.createElement(
          'li',
          { key: `notice-li-${no}` },
          <>
            {title}
            {Number(no) === activeBoard
              ? board
              : Number(no) === activeNotice
              ? notice
              : null}
          </>,
        ),
      )

      if ((idx + 1) % 2 === 0) {
        ul.push(
          React.createElement(
            'ul',
            {
              key: `notice-ul-${no}`,
            },
            children,
          ),
        )

        children = []
      }
    })

    return React.createElement('div', null, ul)
  }

  const handleBoardClick = (no: number) => {
    if (no > 2) {
      setActiveBoard(no)
    } else {
      setActiveNotice(no)
    }
  }

  const handleItemClick = (key: string) => {
    setAcitveItem(key)
  }

  return (
    <>
      <div className="slide">
        {mainBanners && (
          <CustomSwiper
            slidesPerView={1}
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            centeredSlides
            loop
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="slideBox"
          >
            {mainBanners}
          </CustomSwiper>
        )}
      </div>
    </>
  )
}

export { MainLG }
