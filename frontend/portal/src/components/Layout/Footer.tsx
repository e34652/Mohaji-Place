import ActiveLink from '@components/ActiveLink'
import { ASSET_PATH } from '@constants/env'
import Hidden from '@material-ui/core/Hidden'
import { ISideMenu, menuStateAtom } from '@stores'
import { translateToLang } from '@utils'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'

const Footer = () => {
  const { i18n } = useTranslation()
  const menus = useRecoilValue(menuStateAtom)

  const [bottom, setBottom] = useState<ISideMenu>(undefined)

  useEffect(() => {
    if (menus) {
      setBottom(menus.find(item => item.menuType === 'bottom'))
    }
  }, [menus])

  return (
    <>
      <footer>
        <div>
          <ul>
            {bottom &&
              bottom.children.map(item => (
                <li key={`bottom-li-${item.id}`}>
                  <ActiveLink
                    href={item.urlPath}
                    children={translateToLang(i18n.language, item)}
                  />
                </li>
              ))}
          </ul>
          <Hidden xsDown>
            <div>
              <div>
                <dl>
                  <dt>대표문의메일</dt>
                  <dd>
                    <a href="mailto:egovframesupport@gmail.com">
                      support@mhjplace.com
                    </a>
                  </dd>
                </dl>
                <dl>
                  <dt>대표전화</dt>
                  <dd>
                    <a href="tel:1566-3598">010-1010-1010</a>
                  </dd>
                </dl>
                <dl>
                  <dt>상담문의</dt>
                  <dd>
                    <a href="tel:070-4448-2674">010-1234-5678</a>
                  </dd>
                </dl>
              </div>
              <div>
                Copyright (C) 2021 Ministry of the Interior and Safety.
                <br className="hidden" /> All Right Reserved.
              </div>
            </div>
          </Hidden>
          <Hidden smUp>
            <p className="mobCopy">
              (C) 표준프레임워크 포털 &nbsp;&nbsp; All Rights Reserved.
            </p>
          </Hidden>
        </div>
      </footer>
    </>
  )
}

export default Footer
