import axios from "axios";

const API_URL = "http://localhost:3600";
export class APIService{
	constructor(){}
	getTasks() {
		const url = `${API_URL}/tasks`;
		return axios.get(url).then( response => response.data );
	}
	completeTask( task ) {
		const url = `${API_URL}/tasks/complete/${task.id}`;
		axios.patch( url ).then( response => response.data );
	}
	addTask( name ) {
		const url = `${API_URL}/tasks`;
		return axios.post( url, { name } ).then( response =>  response.data.task );
	}
	editTask( task ) {
		const url = `${API_URL}/tasks/${task.id}`;
		axios.patch( url, task ).then( response => response.data );
	}
	deleteTask( task ) {
		const url = `${API_URL}/tasks/${task.id}`;
		axios.delete( url ).then( response => response.data );
	}
}