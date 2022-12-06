import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getBranchInfo,
  getCompanyBranches,
  getProperties
} from '../api/domainAPI'
import { setDetailBranch } from '../Redux/Reducers/branchInfoReducer/branchInfoActions'
import {
  setCompanyBranches,
  setSelectedBranch
} from '../Redux/Reducers/companyReducer/companyActions'
import { setListingProperties } from '../Redux/Reducers/listingProperties/listingPropertiesActions'
import { IBranch, IMoreDetailBranch, IProperty, IRootState } from '../type.d'
import { getLocalStorage, setLocalStorage } from '../utils/_utils'

const useFetchData = () => {
  const dispatch = useDispatch()
  let { companyName, selectedBranch } = useSelector(
    (state: IRootState) => state.company
  )

  // todo -> set Company branches and default branch
  useEffect(() => {
    const result = getCompanyBranches(companyName)
    const selectedBranch = getLocalStorage('selectedBranch')
    result.then(resp => {
      const res = resp as any as Array<IBranch>
      dispatch(setCompanyBranches(res))
      let branchID = res.map(branch => branch.id)
      // todo -> if local storage `selectedBranch` are one of the branches, then go on
      if (branchID.includes(selectedBranch)) {
        dispatch(setSelectedBranch(selectedBranch))
      } else {
        setLocalStorage('selectedBranch', res[0].id)
        dispatch(setSelectedBranch(res[0].id))
      }
    })
  }, [companyName, dispatch])

  useEffect(() => {
    let selectedBranch = getLocalStorage('selectedBranch')

    // todo -> set listing properties
    const result = getProperties(selectedBranch)
    result.then(resp => {
      let res = resp as any as Array<IProperty>
      dispatch(setListingProperties(res))
    })

    // todo -> get info for selected branch
    let moreDetailBranchResult = getBranchInfo(selectedBranch)
    moreDetailBranchResult.then(resp => {
      let res = resp as any as IMoreDetailBranch
      dispatch(setDetailBranch(res))
    })
  }, [selectedBranch, dispatch])
}

export default useFetchData
