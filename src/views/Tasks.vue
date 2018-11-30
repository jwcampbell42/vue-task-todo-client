<template>
<div class="tasks">
		<h1>Tasks</h1>
		<b-container><b-row><b-col md="10" offset-md="1">
		<b-table outlined striped :fields="fields" :items="tasks">
			<template slot="Id" slot-scope="data"> {{ data.item.id }} </template>
			<template slot="Name" slot-scope="data">
				<span v-b-tooltip.hover title="Double-click to edit."
					@dblclick="editTask(data.item, data.index)"
					v-show="!(editing == data.index)">
						{{ data.item.name }}
				</span>
				<b-form-input class="edit" type="text"
						v-model="data.item.name"
						v-show="editing == data.index"
						v-task-focus="data.item == editedTask"
						@keyup.enter.native="doneEdit(data.item)"
						@keyup.esc.native="cancelEdit(data.item)">
				</b-form-input>
			</template>
			<template slot="Completed" slot-scope="data">
				<b-form-checkbox v-model="data.item.completed"
					value="1" unchecked-value="0"
					@input="completeTask( data.item.id )">
				</b-form-checkbox>
			</template>
			<template slot="Delete" slot-scope="data">
				<b-button variant="danger" @click="deleteTask( data.item, data.index )">
					<font-awesome-icon icon="trash"/>
				</b-button>
			</template>
		</b-table></b-col></b-row>
		<b-row><b-col md="5" offset-md="3">
		<b-input-group>
			<b-form-input class="new-task" type="text"
						placeholder="Create a new task."
						v-model="newTask"
						@keyup.enter.native="addTask">
			</b-form-input>
		</b-input-group></b-col></b-row>
		</b-container>
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
			fields: [
				"Id",
				"Name",
				"Completed",
				"Delete"
			],
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
		async completeTask ( id ) {
			await apiService.completeTask( id );
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
