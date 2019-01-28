import React from 'react'
import wheal from '../../img/Bankwheal.svg'

const Bankwheal = () => {

	const size = {
		width: 40,
		height: 40
	}

	return (
		<div>
			<img style={size} src={wheal} alt="Loading wheal"/>
		</div>
	)
}

export default Bankwheal