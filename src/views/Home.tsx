import SelectInput from '../components/TextFiled/SelectInput'
import ButtonIcon from '../components/ButtonIcon'
import InputForm from '../components/InputForm/InputForm'
import InputFormBody from '../components/InputForm/InputFormBody'
import InputFormFooter from '../components/InputForm/InputFormFooter'
import SearchSection from '../components/SearchSection'
import SliderInput from '../components/TextFiled/SliderInput'
import SwitchInput from '../components/TextFiled/SwitchInput'
import TabDisplay from '../components/TabDisplay/TabDisplay'

import SendIcon from '@mui/icons-material/Send'
import ClearIcon from '@mui/icons-material/Clear'
import { useCallback, useState } from 'react'
import { selectInputText, suburbList } from '../constant/suburbList'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState } from '../type.d'
import {
  scrollToTop,
  separateRentAndSale,
  setLocalStorage
} from '../utils/_utils'
import Header from '../components/Header/Header'
import Footer from '../components/Footer'
import { setSelectedBranch } from '../Redux/Reducers/companyReducer/companyActions'
import ScrollToButton from '../components/ScrollToButton'
import useMonitorScrollTop from '../ReactHook/useMonitorScrollTop'
import TitleText from '../components/TitleText'
import backgroundImg from '../assets/images/Elephant.jpg'
import { Link } from 'react-router-dom'

const Home = () => {
  // * get state from 'Redux' and hooks
  const { company, properties, branchInfo } = useSelector(
    (state: IRootState) => state
  )
  const { branches, selectedBranch } = company
  let data = separateRentAndSale(properties)
  const dispatch = useDispatch()

  // * all data for filter
  const [suburb, setSuburb] = useState('')
  const [rent, setRent] = useState(true)
  const [bedrooms, setBedrooms] = useState<number[]>([2, 3])
  const [bathrooms, setBathrooms] = useState<number[]>([1, 2])
  const [carspaces, setCarspaces] = useState<number[]>([1, 1])

  // * scrollToTopButton display or not
  let showScrollTopButton = useMonitorScrollTop()

  // * control if 'filter' display and 'title text'
  const [display, setDisplay] = useState(false)
  const handleFormDisplay = useCallback(() => {
    if (!showScrollTopButton) {
      setDisplay(prev => {
        return !prev
      })
    } else {
      scrollToTop()

      setDisplay(true)
    }
  }, [showScrollTopButton])

  // * method for child component
  const handleSelectBranch = useCallback(
    (id: number) => {
      dispatch(setSelectedBranch(id))
      setLocalStorage('selectedBranch', id)
    },
    [dispatch]
  )

  return (
    <>
      <Header
        showBranch={branches}
        setBranch={handleSelectBranch}
        selectedBranch={selectedBranch}
        handleFormDisplay={handleFormDisplay}
      />

      <SearchSection backgroundImg={backgroundImg}>
        <TitleText fontColor="white" show={display}>
          The best way to find your home
        </TitleText>

        <InputForm
          filterDisplay={display}
          bgColorFrom="rgba(255, 255, 255, 0.7)"
          bgColorTo="rgba(255, 255, 255, 0.7)"
        >
          <InputFormBody>
            <SelectInput
              data={suburbList}
              text={selectInputText}
              value={suburb}
              SelectFunction={city => setSuburb(city)}
            ></SelectInput>

            <SwitchInput
              textAfter="Rent"
              textBefore="Buy"
              rentCheck={rent}
              setRentCheck={check => setRent(check)}
            />

            <SliderInput
              value={bedrooms}
              label="Bedrooms"
              setValue={value => setBedrooms(value)}
            />
            <SliderInput
              value={bathrooms}
              label="Bathrooms"
              setValue={value => setBathrooms(value)}
            />
            <SliderInput
              value={carspaces}
              label="Car Park"
              setValue={value => setCarspaces(value)}
            />
          </InputFormBody>

          <InputFormFooter>
            <ButtonIcon icon={<ClearIcon />} text="Clear" variant="outlined" />
            <Link
              to={`/searchproperty?suburb=${suburb}&rent=${rent}&bedrooms=${bedrooms}&bathrooms=${bathrooms}&carspaces=${carspaces}`}
              style={{ textDecoration: 'none' }}
            >
              <ButtonIcon icon={<SendIcon />} text="Send" />
            </Link>
          </InputFormFooter>
        </InputForm>
      </SearchSection>

      <TabDisplay data={data} agents={branchInfo.agents} id="tabDisplay" />

      <Footer />

      <ScrollToButton show={showScrollTopButton} />
    </>
  )
}

export default Home
