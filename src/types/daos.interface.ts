/**
 * Generic interface for the Data Access Objects (DAO's) to interact with the data.
 * The interface defines methods for creating and fetching data by ID.
 *
 * @template D The type of the data object that the DAO will use
 *
 * @author Rafael Beltran <rafabeltrans17@gmail.com>
 */

export interface DataAccessObject<D> {
	/**
	 * Creates a new record in the database
	 *
	 * @param {D} data The data to store in the database
	 * @returns {void} This method doesn't return any value
	 */
	create(data: D): Promise<void>;

	/**
	 * Fetches a record by its ID
	 *
	 * @param{number} id The identifier of the record to fetch
	 * @returns {Promise<D>} A promise that resolves once the data is fetched (if no data found it'll return undefined)
	 */
	fetchById(id: number): Promise<D | undefined>;
}
