/* ---------------------------------------------------------------------- */
/* -- Composant de lecture et d'affichage des stats pour le client -*/
/* ---------------------------------------------- ------------------------*/

import 'react-toastify/dist/ReactToastify.css';
import { db } from '../config/firebase';
import { getDoc, doc } from "firebase/firestore";
import React, {useState} from 'react';
import { citysuggester } from '../components/CitySuggester';
export default function Table() {


	/* Déclaration d'Hooks permettant de mettre à 
	jour dynamiquement les composants [variable, fonction de maj] */

	// booléen d'affichage du graphe 
    const [showChart, setChart] = useState(false);
	// booléen d'affichage du tableau
	const [showTest, setTable] = useState(false);
	// message d'erreur
	const [errorForm, showError] = useState(false);
	// message d'erreur
	const [errorForm2, showError2] = useState(false);
	// mot de passe, global
	const [cityPassword, setCityPassword] = useState("");
	// nom de la ville, global
	const [cityName, setCityName] = useState("");


	/*Cette fonction lance la session de statistiques, vérifie que la ville existe dans la BDD et le mot de passe (a modifier)*/ 
	async function startTest (e) {

		// Empêche le rafraîchissement de page
		e.preventDefault();

		// récupération des données du formulaire
		const formData = new FormData(e.target);
		const formProps = Object.fromEntries(formData);
		let { city_name, city_password } = formProps

			 
		// Check de l'existence de la ville dans notre bdd
		const docRef = doc(db, "City", city_name);
		const docSnap = await getDoc(docRef);
		const docRef2 = doc(db, "Password", city_password);
		const docSnap2 = await getDoc(docRef2);
		console.log(docSnap2)
		// si la ville existe on procède
		if (docSnap.exists() && docSnap2.exists() ) {
			// globalise les données du formulaire pour plus tard
			setCityName(city_name)
			setCityPassword(city_password)
			
			//on commence la session
			setTable(true)
			showError(false)
			setChart(true)
		}
		else if (docSnap.exists() && !docSnap2.exists() ) {
			// code for incorrect password
			// Sinon, on affiche une erreur
			showError2(true);
		  }
		  else if (!docSnap.exists() && !docSnap2.exists() ) {
			// code for incorrect password
			// Sinon, on affiche une erreur
			showError2(true);
		  }
		else if (!docSnap.exists() && docSnap2.exists() ){
		// Si la ville n'existe pas, on appelle citysuggester pour proposer une ville similaire
		const suggestedCity = await citysuggester(city_name);

// Si une ville similaire est trouvée, on propose à l'utilisateur de continuer avec cette ville
if (suggestedCity !== null) {
  if (window.confirm(`Avez-vous voulu dire ${suggestedCity} ?`)) {
    city_name = suggestedCity;

    setCityName(city_name);
    setCityPassword(city_password);

    setTable(true);
    showError(false);
    setChart(true);
  }
  else {
	// Sinon, on affiche une erreur
	showError(true);
  }
}
}

	}


	/*Cette fonction lit la database à partir du nom de la ville login et return le tableau*/ 

	async function Read(login) {
		console.log(login)
		const docRef = doc(db, "City", login);
		const docSnap = await getDoc(docRef);
		
		if (docSnap.exists()) {
		  const data = docSnap.data();
		  const { Routes } = data;
		  const dataArray = [];
		
		  for (const routeId of Routes) {
			const routeDocRef = doc(db, "Routes", routeId);
			const routeDocSnap = await getDoc(routeDocRef);
		
			if (routeDocSnap.exists()) {
			  const routeData = routeDocSnap.data();
			  dataArray.push({
				id: routeData.id,
				nameCity: routeData.nameCity,
				nameRoute: routeData.nameRoute,
				nbrSessions: routeData.nbrSessions
			  });
			}
		  }
		
		  return dataArray;
		} else {
		  console.log("No such document!");
		  return [];
		}
	  }
  
  
  /*Reader est un composant qui permet d'afficher le tableau lui-même à partir des données récupérées dans Read*/ 
  const Reader = ({cname}) => {
  /*On déclare un array et un booléen pour stocker les data extraites par Read et gérer l'asynchronisation*/ 
  const [dataread, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
	
	React.useEffect(() => {
  
	  const fetchUserData = async () => {
		/*On set Loading à true en attendant la réponse de la fonction async*/ 
		setLoading(true);
		const response = await Read(cityName).then((value) => {
		const objx = value
		/*on stocke la data dans dataread et on passe Loading à false pour indiquer que les données sont bien définies*/ 
		setData(value)
		setLoading(false)
	})
	
	  };
	  /*On appelle la fonction précédemment créée*/ 
	  fetchUserData();
	  
	  
	}, []);
  /*Si Loading est true, on doit attendre le retour des données qui sont en train de charger avec await Read()*/ 

	if (loading) return <p>Loading...</p> 

	else {
	/*Sinon on crée le tableau */ 
	return ( <table>
		<thead>
		  <tr>
			<th>ID </th>
			<th>City name </th>
			<th>Route name </th>
			<th>Number of sessions </th>
			{/* <th>Number of trees planted</th> */}
		  </tr>
		</thead>
		<tbody>
		{/*Pour chaque item de dataread on lit les values et on les affiche sur une ligne */ }
		{dataread.map(item => (
		  
			<tr>
			  <td>{ item.id }</td>
			  {console.log(item.nameCity)}
			  <td>{ item.nameCity }</td>
			  <td>{ item.nameRoute}</td>
			  <td>{ item.nbrSessions }</td>
			</tr>
		))}
		</tbody>
	  </table>
);}}
  
	  
    
		

	// rendu html
	return (
		<div className='fullHeight'>
			{/* (1ère cond, if) condition de démarrage de la session, showTest doit être == true */}
			{ showTest ? (
				<div className=''>

				
							<h4 className='mt-4'>Vos statistiques pour le 1er trimestre 2023</h4>
							
							{/* Création de notre tableau de réponses comme 
							données (utiliser un dimensionnement en % pour du responsive) */}
							
							<React.StrictMode>
							<Reader cname={cityName}/>
							</React.StrictMode>				
						</div>
					

			// (1ère cond, else)  si la session n'a pas commencé on reste sur l'affichage de démarrage 
			) : (
				<>
				{/* <img src={} width="35%" height='45%' className='mt-1 mb-5' alt=""/><br/> */}
				<form onSubmit={startTest}>
					<div className="col  mb-3 mt-3 text-center">

					<input className="form-control form-control-lg m-auto input-quizz" 
						placeholder="Votre ville" type="text" name="city_name" required />

					<input className="form-control form-control-lg m-auto mt-3 input-quizz" 
						placeholder="Votre mot de passe" type="text" name="city_password" required />
					

					{/* message d'erreur si la ville n'est pas enregistrée */}
					<p className={(errorForm) ? "msgError" : 'hide-error'}> Nous sommes désolés mais les statistiques de votre ville ne semblent pas accessibles. N'hésitez pas à nous contacter par mail et nous résoudrons ce problème au plus vite.</p>
					{/* message d'erreur si le mot de passe est mauvails*/}
					<p className={(errorForm2) ? "msgError" : 'hide-error'}> Votre mot de passe semble erroné. Veuillez l'entrer à nouveau ou nous contacter. </p>
					
					
					{/* bouton d'envoi du formulaire */}
					<button type="submit" className="btn btn-danger mt-3 btn-lg orange">Accéder à vos statistiques</button>
					</div>
				</form>	
				</>
			)}
		</div>
	);



}

