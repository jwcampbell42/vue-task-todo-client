<template>
<div class="tasks">
		<h1>Tasks</h1>
		<table class="table center table-bordered table-hover">
			<thead>
				<tr>
					<th>Id</th>
					<th>Name (Double-click to edit)</th>
					<th>Completed</th>
					<th>Delete</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="( task, index ) in tasks"
					class="task"
					:key="task.id"
					:class=" { editing: task == editedTask }">
					<td>
						<span><b> {{ task.id }} </b></span>
					</td>
					<td>
						<label @dblclick="editTask(task, index)" v-show="!(editing == index)"><b>{{ task.name }}</b></label><br />
						<input class="edit" type="text"
						v-model="task.name"
						v-show="editing == index"
						v-task-focus="task == editedTask"
						@keyup.enter="doneEdit(task)"
						@keyup.esc="cancelEdit(task)">
					</td>
					<td>
						<input class="toggle" type="checkbox" v-model="task.completed" @click="completeTask( task )">
					</td>
					<td>
						<button @click="deleteTask( task, index )">X</button>
					</td>
				</tr>
				<tr>
					<td></td>
					<td>
						<input class="new-task" type="text"
						placeholder="Create a new task."
						v-model="newTask"
						@keyup.enter="addTask">
					</td>
					<td>
						<input class="toggle" type="checkbox"  @click="completeTask( task )">
					</td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import {APIService} from "@/services/API";
const apiService = new APIService();
export default {
	name: "tasks",
	data () {
		return {
			tasks: [],
			newTask: "",
			editedTask: null,
			editing: null
		}
	},
	mounted () {
		this.getTasks();
	},
	methods: {
		async getTasks () {
			const response = await apiService.getTasks()
			this.tasks = response.data
		},
		async completeTask ( task ) {
			await apiService.completeTask( task );
		},
		async addTask () {
			let name = this.newTask && this.newTask.trim();
			if( !name ) {
				return;
			}
			let task = await apiService.addTask( name );
			this.tasks.push( task );
			this.newTask = "";
		},
		async deleteTask( task, index ) {
			await apiService.deleteTask( task );
			this.tasks.splice( index, 1 );
		},
		editTask ( task, index ) {
			this.editing = index;
			this.beforeEditCache = task.name;
			this.editedTask = task;
		},
		async doneEdit ( task ) {
			if( !this.editedTask ){
				return;
			}
			task.name = task.name.trim();
			if( !task.name ) {
				await this.removeTask( task )
				return;
			}
			await apiService.editTask( task );
			this.editing = null;
		},
		cancelEdit ( task ) {
			this.editedTask = null;
			task.name = this.beforeEditCache;
			this.editing = null;
		}
	},
	directives: {
		"task-focus": function( el, binding ) {
			if( binding.value ) {
				el.focus();
			}
		}
	}

}
</script>
<style scoped>
table.center {
	width:50%;
	margin-left:25%;
	margin-right:25%;
}
table, th, td {
	border: 1px solid black;
}
table {
	border-collapse: collapse;
}
</style>
